import { and, eq, gte, ilike, isNull, lte, ne, not, or } from "drizzle-orm";
import { cartoes, contas, lancamentos } from "@/db/schema";
import {
	ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
	INITIAL_BALANCE_NOTE,
} from "@/lib/accounts/constants";
import { db } from "@/lib/db";
import { getAdminPagadorId } from "@/lib/pagadores/get-admin-id";
import { safeToNumber } from "@/lib/utils/number";
import { addMonthsToPeriod, comparePeriods } from "@/lib/utils/period";
import type { CartoesMap } from "./expense-period-logic";
import { belongsToPeriod } from "./expense-period-logic";

const DESPESA = "Despesa";
const TRANSFERENCIA = "Transferência";

export type RawExpenseRow = {
	id: string;
	name: string | null;
	amount: number;
	period: string | null;
	purchaseDate: Date | string;
	cartaoId: string | null;
	pagadorId: string | null;
	condition: string;
	paymentMethod: string;
	categoriaId: string | null;
	isSettled: boolean | null;
};

export type ExpenseRowsByPeriod = Map<string, RawExpenseRow[]>;

export type FetchExpenseRowsOptions = {
	/** Se true (padrão), considera apenas o pagador admin. Se false, todos os pagadores (ex.: widget Pagadores). */
	adminOnly?: boolean;
	/** Quando informado, filtra despesas apenas deste pagador (ex.: painel do pagador). */
	pagadorId?: string;
};

/**
 * Busca lançamentos de despesa e agrupa por período usando a mesma regra do metrics:
 * sem cartão → pelo period do lançamento; com cartão → pela data de compra no ciclo de fechamento.
 */
export async function fetchExpenseRowsForPeriods(
	userId: string,
	periods: string[],
	options: FetchExpenseRowsOptions = {},
): Promise<{ rowsByPeriod: ExpenseRowsByPeriod; cartoesMap: CartoesMap }> {
	const { adminOnly = true, pagadorId } = options;
	const rowsByPeriod: ExpenseRowsByPeriod = new Map();
	for (const p of periods) {
		rowsByPeriod.set(p, []);
	}

	if (periods.length === 0) {
		return { rowsByPeriod, cartoesMap: new Map() };
	}

	const adminPagadorId = pagadorId ? null : await getAdminPagadorId(userId);
	if (!pagadorId && adminOnly && !adminPagadorId) {
		return { rowsByPeriod, cartoesMap: new Map() };
	}
	if (pagadorId && !pagadorId.trim()) {
		return { rowsByPeriod, cartoesMap: new Map() };
	}

	const sorted = [...periods].sort(comparePeriods);
	const startPeriod = addMonthsToPeriod(sorted[0], -1);
	const endPeriod = addMonthsToPeriod(sorted[sorted.length - 1], 1);

	const periodSet = new Set(periods);

	const baseWhere = and(
		eq(lancamentos.userId, userId),
		gte(lancamentos.period, startPeriod),
		lte(lancamentos.period, endPeriod),
		eq(lancamentos.transactionType, DESPESA),
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
	const whereWithPagador = pagadorId
		? and(baseWhere, eq(lancamentos.pagadorId, pagadorId))
		: adminOnly
			? and(baseWhere, eq(lancamentos.pagadorId, adminPagadorId!))
			: baseWhere;

	const [cartoesRows, rows] = await Promise.all([
		db
			.select({ id: cartoes.id, closingDay: cartoes.closingDay })
			.from(cartoes)
			.where(eq(cartoes.userId, userId)),
		db
			.select({
				id: lancamentos.id,
				name: lancamentos.name,
				period: lancamentos.period,
				purchaseDate: lancamentos.purchaseDate,
				cartaoId: lancamentos.cartaoId,
				amount: lancamentos.amount,
				pagadorId: lancamentos.pagadorId,
				condition: lancamentos.condition,
				paymentMethod: lancamentos.paymentMethod,
				categoriaId: lancamentos.categoriaId,
				isSettled: lancamentos.isSettled,
			})
			.from(lancamentos)
			.leftJoin(contas, eq(lancamentos.contaId, contas.id))
			.where(whereWithPagador),
	]);

	const cartoesMap: CartoesMap = new Map();
	for (const c of cartoesRows) {
		const day = Math.min(
			31,
			Math.max(1, Number.parseInt(c.closingDay ?? "1", 10) || 1),
		);
		cartoesMap.set(c.id, day);
	}

	for (const row of rows) {
		const amount = safeToNumber(row.amount);
		const absAmount = Math.abs(amount);
		for (const targetPeriod of periods) {
			if (!belongsToPeriod(row, targetPeriod, cartoesMap)) continue;
			const list = rowsByPeriod.get(targetPeriod)!;
			list.push({
				id: row.id,
				name: row.name ?? null,
				amount: absAmount,
				period: row.period,
				purchaseDate: row.purchaseDate,
				cartaoId: row.cartaoId,
				pagadorId: row.pagadorId,
				condition: row.condition ?? "",
				paymentMethod: row.paymentMethod ?? "",
				categoriaId: row.categoriaId,
				isSettled: row.isSettled ?? null,
			});
			break;
		}
	}

	return { rowsByPeriod, cartoesMap };
}
