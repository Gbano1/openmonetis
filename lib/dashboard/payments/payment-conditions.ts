import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";

export type PaymentConditionSummary = {
	condition: string;
	amount: number;
	percentage: number;
	transactions: number;
};

export type PaymentConditionsData = {
	conditions: PaymentConditionSummary[];
};

export async function fetchPaymentConditions(
	userId: string,
	period: string,
): Promise<PaymentConditionsData> {
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [period], {
		adminOnly: true,
	});
	const rows = rowsByPeriod.get(period) ?? [];

	const byCondition = new Map<string, { amount: number; count: number }>();
	for (const row of rows) {
		const key = row.condition ?? "";
		const cur = byCondition.get(key) ?? { amount: 0, count: 0 };
		cur.amount += row.amount;
		cur.count += 1;
		byCondition.set(key, cur);
	}

	const summaries = Array.from(byCondition.entries()).map(([condition, { amount, count }]) => ({
		condition,
		amount,
		transactions: count,
	}));

	const overallTotal = summaries.reduce((acc, item) => acc + item.amount, 0);

	const conditions = summaries
		.map((item) => ({
			condition: item.condition,
			amount: item.amount,
			transactions: item.transactions,
			percentage:
				overallTotal > 0
					? Number(((item.amount / overallTotal) * 100).toFixed(2))
					: 0,
		}))
		.sort((a, b) => b.amount - a.amount);

	return {
		conditions,
	};
}
