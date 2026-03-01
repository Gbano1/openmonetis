import { and, asc, eq, gte, ilike, isNull, lte, ne, not, or } from "drizzle-orm";
import { cartoes, contas, lancamentos } from "@/db/schema";
import {
	ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
	INITIAL_BALANCE_NOTE,
} from "@/lib/accounts/constants";
import { db } from "@/lib/db";
import { getAdminPagadorId } from "@/lib/pagadores/get-admin-id";
import { safeToNumber } from "@/lib/utils/number";
import {
	addMonthsToPeriod,
	buildPeriodRange,
	comparePeriods,
	getInvoiceDateRange,
	getPreviousPeriod,
} from "@/lib/utils/period";

const RECEITA = "Receita";
const DESPESA = "Despesa";
const TRANSFERENCIA = "Transferência";

type MetricPair = {
	current: number;
	previous: number;
};

export type DashboardCardMetrics = {
	period: string;
	previousPeriod: string;
	receitas: MetricPair;
	despesas: MetricPair;
	balanco: MetricPair;
	previsto: MetricPair;
};

type PeriodTotals = {
	receitas: number;
	despesas: number;
	balanco: number;
};

const createEmptyTotals = (): PeriodTotals => ({
	receitas: 0,
	despesas: 0,
	balanco: 0,
});

const ensurePeriodTotals = (
	store: Map<string, PeriodTotals>,
	period: string,
): PeriodTotals => {
	if (!store.has(period)) {
		store.set(period, createEmptyTotals());
	}
	const totals = store.get(period);
	// This should always exist since we just set it above
	if (!totals) {
		const emptyTotals = createEmptyTotals();
		store.set(period, emptyTotals);
		return emptyTotals;
	}
	return totals;
};

// Re-export for backward compatibility
export { getPreviousPeriod };

export async function fetchDashboardCardMetrics(
	userId: string,
	period: string,
): Promise<DashboardCardMetrics> {
	const previousPeriod = getPreviousPeriod(period);

	const adminPagadorId = await getAdminPagadorId(userId);
	if (!adminPagadorId) {
		return {
			period,
			previousPeriod,
			receitas: { current: 0, previous: 0 },
			despesas: { current: 0, previous: 0 },
			balanco: { current: 0, previous: 0 },
			previsto: { current: 0, previous: 0 },
		};
	}

	// Limitar scan histórico a 24 meses para evitar scans progressivamente mais lentos
	const startPeriod = addMonthsToPeriod(period, -24);

	const baseWhere = and(
		eq(lancamentos.userId, userId),
		eq(lancamentos.pagadorId, adminPagadorId),
		gte(lancamentos.period, startPeriod),
		lte(lancamentos.period, period),
		ne(lancamentos.transactionType, TRANSFERENCIA),
		or(
			isNull(lancamentos.note),
			not(ilike(lancamentos.note, `${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`)),
		),
		or(
			ne(lancamentos.note, INITIAL_BALANCE_NOTE),
			isNull(contas.excludeInitialBalanceFromIncome),
			eq(contas.excludeInitialBalanceFromIncome, false),
		),
	);

	const [cartoesRows, rows] = await Promise.all([
		db
			.select({ id: cartoes.id, closingDay: cartoes.closingDay })
			.from(cartoes)
			.where(eq(cartoes.userId, userId)),
		db
			.select({
				period: lancamentos.period,
				transactionType: lancamentos.transactionType,
				amount: lancamentos.amount,
				purchaseDate: lancamentos.purchaseDate,
				cartaoId: lancamentos.cartaoId,
			})
			.from(lancamentos)
			.leftJoin(contas, eq(lancamentos.contaId, contas.id))
			.where(baseWhere)
			.orderBy(asc(lancamentos.period), asc(lancamentos.transactionType)),
	]);

	const cartoesMap = new Map<string, number>();
	for (const c of cartoesRows) {
		const day = Math.min(31, Math.max(1, Number.parseInt(c.closingDay ?? "1", 10) || 1));
		cartoesMap.set(c.id, day);
	}

	const periodTotals = new Map<string, PeriodTotals>();
	const allPeriodsInRange = buildPeriodRange(startPeriod, period);

	for (const p of allPeriodsInRange) {
		ensurePeriodTotals(periodTotals, p);
	}

	for (const row of rows) {
		if (!row.period) continue;
		const amount = safeToNumber(row.amount);
		if (row.transactionType === RECEITA) {
			const totals = ensurePeriodTotals(periodTotals, row.period);
			totals.receitas += amount;
			continue;
		}
		if (row.transactionType !== DESPESA) continue;

		const absAmount = Math.abs(amount);
		if (!row.cartaoId) {
			const totals = ensurePeriodTotals(periodTotals, row.period);
			totals.despesas += absAmount;
			continue;
		}

		const closingDay = cartoesMap.get(row.cartaoId);
		if (closingDay === undefined) {
			const totals = ensurePeriodTotals(periodTotals, row.period);
			totals.despesas += absAmount;
			continue;
		}

		for (const p of allPeriodsInRange) {
			const range = getInvoiceDateRange(p, closingDay);
			const raw = row.purchaseDate;
			const purchaseDate =
				raw instanceof Date
					? raw
					: (() => {
							const s = String(raw).slice(0, 10);
							const [y, m, d] = s.split("-").map(Number);
							return new Date(y, (m ?? 1) - 1, d ?? 1);
						})();
			const start = range.start.getTime();
			const end = range.end.getTime();
			const t = purchaseDate.getTime();
			if (t >= start && t <= end) {
				const totals = ensurePeriodTotals(periodTotals, p);
				totals.despesas += absAmount;
				break;
			}
		}
	}

	ensurePeriodTotals(periodTotals, period);
	ensurePeriodTotals(periodTotals, previousPeriod);

	const earliestPeriod =
		periodTotals.size > 0 ? Array.from(periodTotals.keys()).sort()[0] : period;

	const startRangePeriod =
		comparePeriods(earliestPeriod, previousPeriod) <= 0
			? earliestPeriod
			: previousPeriod;

	const periodRange = buildPeriodRange(startRangePeriod, period);
	const forecastByPeriod = new Map<string, number>();
	let runningForecast = 0;

	for (const key of periodRange) {
		const totals = ensurePeriodTotals(periodTotals, key);
		totals.balanco = totals.receitas - totals.despesas;
		runningForecast += totals.balanco;
		forecastByPeriod.set(key, runningForecast);
	}

	const currentTotals = ensurePeriodTotals(periodTotals, period);
	const previousTotals = ensurePeriodTotals(periodTotals, previousPeriod);

	return {
		period,
		previousPeriod,
		receitas: {
			current: currentTotals.receitas,
			previous: previousTotals.receitas,
		},
		despesas: {
			current: currentTotals.despesas,
			previous: previousTotals.despesas,
		},
		balanco: {
			current: currentTotals.balanco,
			previous: previousTotals.balanco,
		},
		previsto: {
			current: forecastByPeriod.get(period) ?? runningForecast,
			previous: forecastByPeriod.get(previousPeriod) ?? 0,
		},
	};
}
