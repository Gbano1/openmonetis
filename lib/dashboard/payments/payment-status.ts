import { and, eq, sql } from "drizzle-orm";
import { lancamentos } from "@/db/schema";
import { ACCOUNT_AUTO_INVOICE_NOTE_PREFIX } from "@/lib/accounts/constants";
import { toNumber } from "@/lib/dashboard/common";
import { db } from "@/lib/db";
import { getAdminPagadorId } from "@/lib/pagadores/get-admin-id";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";

export type PaymentStatusCategory = {
	total: number;
	confirmed: number;
	pending: number;
};

export type PaymentStatusData = {
	income: PaymentStatusCategory;
	expenses: PaymentStatusCategory;
};

const emptyCategory = (): PaymentStatusCategory => ({
	total: 0,
	confirmed: 0,
	pending: 0,
});

export async function fetchPaymentStatus(
	userId: string,
	period: string,
): Promise<PaymentStatusData> {
	const adminPagadorId = await getAdminPagadorId(userId);
	if (!adminPagadorId) {
		return { income: emptyCategory(), expenses: emptyCategory() };
	}

	// Receita: continua por period do lançamento
	const incomeRows = await db
		.select({
			confirmed: sql<number>`
				coalesce(
					sum(case when ${lancamentos.isSettled} = true then ${lancamentos.amount} else 0 end),
					0
				)
			`,
			pending: sql<number>`
				coalesce(
					sum(case when ${lancamentos.isSettled} = false or ${lancamentos.isSettled} is null then ${lancamentos.amount} else 0 end),
					0
				)
			`,
		})
		.from(lancamentos)
		.where(
			and(
				eq(lancamentos.userId, userId),
				eq(lancamentos.period, period),
				eq(lancamentos.pagadorId, adminPagadorId),
				eq(lancamentos.transactionType, "Receita"),
				sql`(${lancamentos.note} IS NULL OR ${lancamentos.note} NOT LIKE ${`${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`})`,
			),
		);

	// Despesa: mesma regra do metrics (cartão pelo ciclo de fechamento)
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [period], {
		adminOnly: true,
	});
	const expenseRows = rowsByPeriod.get(period) ?? [];

	let incomeConfirmed = 0;
	let incomePending = 0;
	if (incomeRows[0]) {
		incomeConfirmed = toNumber(incomeRows[0].confirmed);
		incomePending = toNumber(incomeRows[0].pending);
	}

	let expenseConfirmed = 0;
	let expensePending = 0;
	for (const row of expenseRows) {
		if (row.isSettled === true) {
			expenseConfirmed += row.amount;
		} else {
			expensePending += row.amount;
		}
	}

	return {
		income: {
			total: incomeConfirmed + incomePending,
			confirmed: incomeConfirmed,
			pending: incomePending,
		},
		expenses: {
			total: expenseConfirmed + expensePending,
			confirmed: expenseConfirmed,
			pending: expensePending,
		},
	};
}
