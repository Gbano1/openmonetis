import { and, asc, eq, gte, ilike, isNull, lte, ne, not, or } from "drizzle-orm";
import { cartoes, categorias, contas, lancamentos } from "@/db/schema";
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
	getInvoiceDateRange,
} from "@/lib/utils/period";

const DESPESA = "Despesa";
const TRANSFERENCIA = "Transferência";

export type DashboardExpenseItem = {
	id: string;
	name: string;
	amount: number;
	purchaseDate: Date;
	paymentMethod: string;
	categoryName: string | null;
	accountOrCardName: string | null;
};

export type DashboardExpensesForPeriodResult = {
	expenses: DashboardExpenseItem[];
	total: number;
};

export async function fetchDashboardExpensesForPeriod(
	userId: string,
	period: string,
): Promise<DashboardExpensesForPeriodResult> {
	const adminPagadorId = await getAdminPagadorId(userId);
	if (!adminPagadorId) {
		return { expenses: [], total: 0 };
	}

	const startPeriod = addMonthsToPeriod(period, -24);

	const baseWhere = and(
		eq(lancamentos.userId, userId),
		eq(lancamentos.pagadorId, adminPagadorId),
		eq(lancamentos.transactionType, DESPESA),
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
				id: lancamentos.id,
				name: lancamentos.name,
				amount: lancamentos.amount,
				purchaseDate: lancamentos.purchaseDate,
				paymentMethod: lancamentos.paymentMethod,
				cartaoId: lancamentos.cartaoId,
				period: lancamentos.period,
				categoryName: categorias.name,
				contaName: contas.name,
				cartaoName: cartoes.name,
			})
			.from(lancamentos)
			.leftJoin(contas, eq(lancamentos.contaId, contas.id))
			.leftJoin(cartoes, eq(lancamentos.cartaoId, cartoes.id))
			.leftJoin(categorias, eq(lancamentos.categoriaId, categorias.id))
			.where(baseWhere)
			.orderBy(asc(lancamentos.purchaseDate), asc(lancamentos.amount)),
	]);

	const cartoesMap = new Map<string, number>();
	for (const c of cartoesRows) {
		const day = Math.min(
			31,
			Math.max(1, Number.parseInt(c.closingDay ?? "1", 10) || 1),
		);
		cartoesMap.set(c.id, day);
	}

	const allPeriodsInRange = buildPeriodRange(startPeriod, period);

	const belongsToPeriod = (
		row: {
			period: string | null;
			purchaseDate: Date | string;
			cartaoId: string | null;
		},
		targetPeriod: string,
	): boolean => {
		if (!row.cartaoId) {
			return row.period === targetPeriod;
		}
		const closingDay = cartoesMap.get(row.cartaoId);
		if (closingDay === undefined) {
			return row.period === targetPeriod;
		}
		const range = getInvoiceDateRange(targetPeriod, closingDay);
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
		return t >= start && t <= end;
	};

	const expenses: DashboardExpenseItem[] = [];
	let total = 0;

	for (const row of rows) {
		if (!belongsToPeriod(row, period)) continue;

		const amount = Math.abs(safeToNumber(row.amount));
		total += amount;
		expenses.push({
			id: row.id,
			name: row.name,
			amount,
			purchaseDate:
				row.purchaseDate instanceof Date
					? row.purchaseDate
					: new Date(String(row.purchaseDate).slice(0, 10)),
			paymentMethod: row.paymentMethod,
			categoryName: row.categoryName ?? null,
			accountOrCardName: row.cartaoName ?? row.contaName ?? null,
		});
	}

	// Ordenar por data decrescente, depois por valor decrescente
	expenses.sort((a, b) => {
		const tA = a.purchaseDate.getTime();
		const tB = b.purchaseDate.getTime();
		if (tB !== tA) return tB - tA;
		return b.amount - a.amount;
	});

	return { expenses, total };
}
