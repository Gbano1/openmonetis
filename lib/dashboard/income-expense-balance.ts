import { and, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { contas, lancamentos } from "@/db/schema";
import {
	ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
	INITIAL_BALANCE_NOTE,
} from "@/lib/accounts/constants";
import { toNumber } from "@/lib/dashboard/common";
import { db } from "@/lib/db";
import { getAdminPagadorId } from "@/lib/pagadores/get-admin-id";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";

export type MonthData = {
	month: string;
	monthLabel: string;
	income: number;
	expense: number;
	balance: number;
};

export type IncomeExpenseBalanceData = {
	months: MonthData[];
};

const MONTH_LABELS: Record<string, string> = {
	"01": "jan",
	"02": "fev",
	"03": "mar",
	"04": "abr",
	"05": "mai",
	"06": "jun",
	"07": "jul",
	"08": "ago",
	"09": "set",
	"10": "out",
	"11": "nov",
	"12": "dez",
};

const generateLast6Months = (currentPeriod: string): string[] => {
	const [yearStr, monthStr] = currentPeriod.split("-");
	let year = Number.parseInt(yearStr ?? "", 10);
	let month = Number.parseInt(monthStr ?? "", 10);

	if (Number.isNaN(year) || Number.isNaN(month)) {
		const now = new Date();
		year = now.getFullYear();
		month = now.getMonth() + 1;
	}

	const periods: string[] = [];

	for (let i = 5; i >= 0; i--) {
		let targetMonth = month - i;
		let targetYear = year;

		while (targetMonth <= 0) {
			targetMonth += 12;
			targetYear -= 1;
		}

		periods.push(`${targetYear}-${String(targetMonth).padStart(2, "0")}`);
	}

	return periods;
};

export async function fetchIncomeExpenseBalance(
	userId: string,
	currentPeriod: string,
): Promise<IncomeExpenseBalanceData> {
	const adminPagadorId = await getAdminPagadorId(userId);
	if (!adminPagadorId) {
		return { months: [] };
	}

	const periods = generateLast6Months(currentPeriod);

	// Receita: por period do lançamento
	const [receitaRows, { rowsByPeriod }] = await Promise.all([
		db
			.select({
				period: lancamentos.period,
				total: sql<number>`coalesce(sum(${lancamentos.amount}), 0)`,
			})
			.from(lancamentos)
			.leftJoin(contas, eq(lancamentos.contaId, contas.id))
			.where(
				and(
					eq(lancamentos.userId, userId),
					eq(lancamentos.pagadorId, adminPagadorId),
					inArray(lancamentos.period, periods),
					eq(lancamentos.transactionType, "Receita"),
					sql`(${lancamentos.note} IS NULL OR ${lancamentos.note} NOT LIKE ${`${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`})`,
					or(
						ne(lancamentos.note, INITIAL_BALANCE_NOTE),
						isNull(contas.excludeInitialBalanceFromIncome),
						eq(contas.excludeInitialBalanceFromIncome, false),
					),
				),
			)
			.groupBy(lancamentos.period),
		fetchExpenseRowsForPeriods(userId, periods, { adminOnly: true }),
	]);

	const dataMap = new Map<string, { income: number; expense: number }>();
	for (const p of periods) {
		dataMap.set(p, { income: 0, expense: 0 });
	}
	for (const row of receitaRows) {
		if (!row.period) continue;
		const entry = dataMap.get(row.period);
		if (entry) entry.income = Math.abs(toNumber(row.total));
	}
	for (const p of periods) {
		const rows = rowsByPeriod.get(p) ?? [];
		const expense = rows.reduce((s, r) => s + r.amount, 0);
		const entry = dataMap.get(p);
		if (entry) entry.expense = expense;
	}

	const months = periods.map((period) => {
		const entry = dataMap.get(period) ?? { income: 0, expense: 0 };
		const [, monthPart] = period.split("-");
		const monthLabel = MONTH_LABELS[monthPart ?? "01"] ?? monthPart;

		return {
			month: period,
			monthLabel: monthLabel ?? "",
			income: entry.income,
			expense: entry.expense,
			balance: entry.income - entry.expense,
		};
	});

	return { months };
}
