import { and, eq, inArray } from "drizzle-orm";
import { categorias, orcamentos } from "@/db/schema";
import { toNumber } from "@/lib/dashboard/common";
import { db } from "@/lib/db";
import { getAdminPagadorId } from "@/lib/pagadores/get-admin-id";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";
import { calculatePercentageChange } from "@/lib/utils/math";
import { getPreviousPeriod } from "@/lib/utils/period";

export type CategoryExpenseItem = {
	categoryId: string;
	categoryName: string;
	categoryIcon: string | null;
	currentAmount: number;
	previousAmount: number;
	percentageChange: number | null;
	percentageOfTotal: number;
	budgetAmount: number | null;
	budgetUsedPercentage: number | null;
};

export type ExpensesByCategoryData = {
	categories: CategoryExpenseItem[];
	currentTotal: number;
	previousTotal: number;
};

export async function fetchExpensesByCategory(
	userId: string,
	period: string,
): Promise<ExpensesByCategoryData> {
	const previousPeriod = getPreviousPeriod(period);

	const adminPagadorId = await getAdminPagadorId(userId);
	if (!adminPagadorId) {
		return { categories: [], currentTotal: 0, previousTotal: 0 };
	}

	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [
		period,
		previousPeriod,
	], { adminOnly: true });

	const currentRows = rowsByPeriod.get(period) ?? [];
	const previousRows = rowsByPeriod.get(previousPeriod) ?? [];

	const byCategory = new Map<
		string,
		{ current: number; previous: number }
	>();
	for (const row of currentRows) {
		const id = row.categoriaId ?? "";
		if (!id) continue;
		const cur = byCategory.get(id) ?? { current: 0, previous: 0 };
		cur.current += row.amount;
		byCategory.set(id, cur);
	}
	for (const row of previousRows) {
		const id = row.categoriaId ?? "";
		if (!id) continue;
		const cur = byCategory.get(id) ?? { current: 0, previous: 0 };
		cur.previous += row.amount;
		byCategory.set(id, cur);
	}

	const categoryIds = Array.from(byCategory.keys());

	const [categoriasRows, budgetRows] = await Promise.all([
		categoryIds.length > 0
			? db.query.categorias.findMany({
					where: and(
						inArray(categorias.id, categoryIds),
						eq(categorias.type, "despesa"),
					),
					columns: { id: true, name: true, icon: true },
				})
			: [],
		db
			.select({
				categoriaId: orcamentos.categoriaId,
				amount: orcamentos.amount,
			})
			.from(orcamentos)
			.where(and(eq(orcamentos.userId, userId), eq(orcamentos.period, period))),
	]);

	const budgetMap = new Map<string, number>();
	for (const row of budgetRows) {
		if (row.categoriaId) {
			budgetMap.set(row.categoriaId, toNumber(row.amount));
		}
	}

	const categoryNameMap = new Map(
		categoriasRows.map((c) => [c.id, { name: c.name, icon: c.icon }]),
	);

	let currentTotal = 0;
	let previousTotal = 0;
	for (const entry of byCategory.values()) {
		currentTotal += entry.current;
		previousTotal += entry.previous;
	}

	const categories: CategoryExpenseItem[] = [];
	for (const [categoryId, entry] of byCategory) {
		const meta = categoryNameMap.get(categoryId);
		if (!meta) continue;
		const percentageChange = calculatePercentageChange(
			entry.current,
			entry.previous,
		);
		const percentageOfTotal =
			currentTotal > 0 ? (entry.current / currentTotal) * 100 : 0;
		const budgetAmount = budgetMap.get(categoryId) ?? null;
		const budgetUsedPercentage =
			budgetAmount && budgetAmount > 0
				? (entry.current / budgetAmount) * 100
				: null;
		categories.push({
			categoryId,
			categoryName: meta.name,
			categoryIcon: meta.icon,
			currentAmount: entry.current,
			previousAmount: entry.previous,
			percentageChange,
			percentageOfTotal,
			budgetAmount,
			budgetUsedPercentage,
		});
	}
	categories.sort((a, b) => b.currentAmount - a.currentAmount);

	return {
		categories,
		currentTotal,
		previousTotal,
	};
}
