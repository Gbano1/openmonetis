import { and, asc, eq, gte, ilike, isNull, lte, not, or, sql, sum } from "drizzle-orm";
import { cartoes, lancamentos } from "@/db/schema";
import { ACCOUNT_AUTO_INVOICE_NOTE_PREFIX } from "@/lib/accounts/constants";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";
import { db } from "@/lib/db";

const RECEITA = "Receita";
const DESPESA = "Despesa";
const PAYMENT_METHOD_CARD = "Cartão de crédito";
const PAYMENT_METHOD_BOLETO = "Boleto";

export type PagadorMonthlyBreakdown = {
	totalExpenses: number;
	totalIncomes: number;
	paymentSplits: Record<"card" | "boleto" | "instant", number>;
};

export type PagadorHistoryPoint = {
	period: string;
	label: string;
	receitas: number;
	despesas: number;
};

export type PagadorCardUsageItem = {
	id: string;
	name: string;
	logo: string | null;
	amount: number;
};

export type PagadorBoletoStats = {
	totalAmount: number;
	paidAmount: number;
	pendingAmount: number;
	paidCount: number;
	pendingCount: number;
};

export type PagadorBoletoItem = {
	id: string;
	name: string;
	amount: number;
	dueDate: string | null;
	boletoPaymentDate: string | null;
	isSettled: boolean;
};

export type PagadorPaymentStatusData = {
	paidAmount: number;
	paidCount: number;
	pendingAmount: number;
	pendingCount: number;
	totalAmount: number;
};

const toISODate = (value: Date | string | null | undefined): string | null => {
	if (!value) return null;
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return typeof value === "string" ? value : null;
};

const toNumber = (value: string | number | bigint | null) => {
	if (typeof value === "number") {
		return value;
	}
	if (typeof value === "bigint") {
		return Number(value);
	}
	if (!value) {
		return 0;
	}
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
};

const formatPeriod = (year: number, month: number) =>
	`${year}-${String(month).padStart(2, "0")}`;

const normalizePeriod = (period: string) => {
	const [yearStr, monthStr] = period.split("-");
	const year = Number.parseInt(yearStr ?? "", 10);
	const month = Number.parseInt(monthStr ?? "", 10);
	if (Number.isNaN(year) || Number.isNaN(month)) {
		throw new Error(`Período inválido: ${period}`);
	}
	return { year, month };
};

const buildPeriodWindow = (period: string, months: number) => {
	const { year, month } = normalizePeriod(period);
	const items: string[] = [];
	let currentYear = year;
	let currentMonth = month;

	for (let i = 0; i < months; i += 1) {
		items.unshift(formatPeriod(currentYear, currentMonth));
		currentMonth -= 1;
		if (currentMonth < 1) {
			currentMonth = 12;
			currentYear -= 1;
		}
	}

	return items;
};

const formatPeriodLabel = (period: string) => {
	try {
		const { year, month } = normalizePeriod(period);
		const formatter = new Intl.DateTimeFormat("pt-BR", {
			month: "short",
		});
		const date = new Date(year, month - 1, 1);
		const rawLabel = formatter.format(date).replace(".", "");
		const label =
			rawLabel.length > 0
				? rawLabel.charAt(0).toUpperCase().concat(rawLabel.slice(1))
				: rawLabel;
		const suffix = String(year).slice(-2);
		return `${label}/${suffix}`;
	} catch {
		return period;
	}
};

const excludeAutoInvoiceEntries = () =>
	or(
		isNull(lancamentos.note),
		not(ilike(lancamentos.note, `${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`)),
	);

type BaseFilters = {
	userId: string;
	pagadorId: string;
	period: string;
};

export async function fetchPagadorMonthlyBreakdown({
	userId,
	pagadorId,
	period,
}: BaseFilters): Promise<PagadorMonthlyBreakdown> {
	const [receitaRows, { rowsByPeriod }] = await Promise.all([
		db
			.select({
				totalAmount: sum(lancamentos.amount).as("total"),
			})
			.from(lancamentos)
			.where(
				and(
					eq(lancamentos.userId, userId),
					eq(lancamentos.pagadorId, pagadorId),
					eq(lancamentos.period, period),
					eq(lancamentos.transactionType, RECEITA),
					excludeAutoInvoiceEntries(),
				),
			),
		fetchExpenseRowsForPeriods(userId, [period], { pagadorId }),
	]);

	const expenseRows = rowsByPeriod.get(period) ?? [];
	const paymentSplits: PagadorMonthlyBreakdown["paymentSplits"] = {
		card: 0,
		boleto: 0,
		instant: 0,
	};
	let totalExpenses = 0;
	for (const row of expenseRows) {
		totalExpenses += row.amount;
		if (row.paymentMethod === PAYMENT_METHOD_CARD) {
			paymentSplits.card += row.amount;
		} else if (row.paymentMethod === PAYMENT_METHOD_BOLETO) {
			paymentSplits.boleto += row.amount;
		} else {
			paymentSplits.instant += row.amount;
		}
	}
	const totalIncomes = Math.abs(toNumber(receitaRows[0]?.totalAmount ?? 0));

	return {
		totalExpenses,
		totalIncomes,
		paymentSplits,
	};
}

export async function fetchPagadorHistory({
	userId,
	pagadorId,
	period,
	months = 6,
}: BaseFilters & { months?: number }): Promise<PagadorHistoryPoint[]> {
	const window = buildPeriodWindow(period, months);
	const start = window[0];
	const end = window[window.length - 1];

	const [receitaRows, { rowsByPeriod }] = await Promise.all([
		db
			.select({
				period: lancamentos.period,
				totalAmount: sum(lancamentos.amount).as("total"),
			})
			.from(lancamentos)
			.where(
				and(
					eq(lancamentos.userId, userId),
					eq(lancamentos.pagadorId, pagadorId),
					gte(lancamentos.period, start),
					lte(lancamentos.period, end),
					eq(lancamentos.transactionType, RECEITA),
					excludeAutoInvoiceEntries(),
				),
			)
			.groupBy(lancamentos.period),
		fetchExpenseRowsForPeriods(userId, window, { pagadorId }),
	]);

	const totalsByPeriod = new Map<
		string,
		{ receitas: number; despesas: number }
	>();
	for (const key of window) {
		totalsByPeriod.set(key, { receitas: 0, despesas: 0 });
	}
	for (const row of receitaRows) {
		const key = row.period ?? undefined;
		if (!key || !totalsByPeriod.has(key)) continue;
		const bucket = totalsByPeriod.get(key)!;
		bucket.receitas = Math.abs(toNumber(row.totalAmount));
	}
	for (const key of window) {
		const rows = rowsByPeriod.get(key) ?? [];
		const bucket = totalsByPeriod.get(key)!;
		bucket.despesas = rows.reduce((s, r) => s + r.amount, 0);
	}

	return window.map((key) => ({
		period: key,
		label: formatPeriodLabel(key),
		receitas: totalsByPeriod.get(key)?.receitas ?? 0,
		despesas: totalsByPeriod.get(key)?.despesas ?? 0,
	}));
}

export async function fetchPagadorCardUsage({
	userId,
	pagadorId,
	period,
}: BaseFilters): Promise<PagadorCardUsageItem[]> {
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [period], {
		pagadorId,
	});
	const rows = rowsByPeriod.get(period) ?? [];
	const cardRows = rows.filter((r) => r.paymentMethod === PAYMENT_METHOD_CARD);
	const byCartaoId = new Map<string, number>();
	for (const r of cardRows) {
		const id = r.cartaoId ?? "";
		if (!id) continue;
		byCartaoId.set(id, (byCartaoId.get(id) ?? 0) + r.amount);
	}
	const cartaoIds = Array.from(byCartaoId.keys());
	if (cartaoIds.length === 0) return [];

	const cartoesRows = await db.query.cartoes.findMany({
		where: (t, { inArray }) => inArray(t.id, cartaoIds),
		columns: { id: true, name: true, logo: true },
	});
	const byId = new Map(cartoesRows.map((c) => [c.id, c]));
	return cartaoIds
		.map((id) => {
			const cartao = byId.get(id);
			return {
				id,
				name: cartao?.name ?? "Cartão",
				logo: cartao?.logo ?? null,
				amount: byCartaoId.get(id) ?? 0,
			};
		})
		.sort((a, b) => b.amount - a.amount);
}

export async function fetchPagadorBoletoStats({
	userId,
	pagadorId,
	period,
}: BaseFilters): Promise<PagadorBoletoStats> {
	const rows = await db
		.select({
			isSettled: lancamentos.isSettled,
			totalAmount: sum(lancamentos.amount).as("total"),
			totalCount: sql<number>`count(${lancamentos.id})`.as("count"),
		})
		.from(lancamentos)
		.where(
			and(
				eq(lancamentos.userId, userId),
				eq(lancamentos.pagadorId, pagadorId),
				eq(lancamentos.period, period),
				eq(lancamentos.paymentMethod, PAYMENT_METHOD_BOLETO),
				excludeAutoInvoiceEntries(),
			),
		)
		.groupBy(lancamentos.isSettled);

	let paidAmount = 0;
	let pendingAmount = 0;
	let paidCount = 0;
	let pendingCount = 0;

	for (const row of rows) {
		const total = Math.abs(toNumber(row.totalAmount));
		const count = toNumber(row.totalCount);
		if (row.isSettled) {
			paidAmount += total;
			paidCount += count;
		} else {
			pendingAmount += total;
			pendingCount += count;
		}
	}

	return {
		totalAmount: paidAmount + pendingAmount,
		paidAmount,
		pendingAmount,
		paidCount,
		pendingCount,
	};
}

export async function fetchPagadorBoletoItems({
	userId,
	pagadorId,
	period,
}: BaseFilters): Promise<PagadorBoletoItem[]> {
	const rows = await db
		.select({
			id: lancamentos.id,
			name: lancamentos.name,
			amount: lancamentos.amount,
			dueDate: lancamentos.dueDate,
			boletoPaymentDate: lancamentos.boletoPaymentDate,
			isSettled: lancamentos.isSettled,
		})
		.from(lancamentos)
		.where(
			and(
				eq(lancamentos.userId, userId),
				eq(lancamentos.pagadorId, pagadorId),
				eq(lancamentos.period, period),
				eq(lancamentos.paymentMethod, PAYMENT_METHOD_BOLETO),
				excludeAutoInvoiceEntries(),
			),
		)
		.orderBy(asc(lancamentos.dueDate));

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		amount: Math.abs(toNumber(row.amount)),
		dueDate: toISODate(row.dueDate),
		boletoPaymentDate: toISODate(row.boletoPaymentDate),
		isSettled: Boolean(row.isSettled),
	}));
}

export async function fetchPagadorPaymentStatus({
	userId,
	pagadorId,
	period,
}: BaseFilters): Promise<PagadorPaymentStatusData> {
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [period], {
		pagadorId,
	});
	const rows = rowsByPeriod.get(period) ?? [];
	let paidAmount = 0;
	let paidCount = 0;
	let pendingAmount = 0;
	let pendingCount = 0;
	for (const row of rows) {
		if (row.isSettled === true) {
			paidAmount += row.amount;
			paidCount += 1;
		} else {
			pendingAmount += row.amount;
			pendingCount += 1;
		}
	}
	return {
		paidAmount,
		paidCount,
		pendingAmount,
		pendingCount,
		totalAmount: paidAmount + pendingAmount,
	};
}
