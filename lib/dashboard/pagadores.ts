import { inArray } from "drizzle-orm";
import { pagadores } from "@/db/schema";
import { db } from "@/lib/db";
import { PAGADOR_ROLE_ADMIN } from "@/lib/pagadores/constants";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";

export type DashboardPagador = {
	id: string;
	name: string;
	email: string | null;
	avatarUrl: string | null;
	totalExpenses: number;
	isAdmin: boolean;
};

export type DashboardPagadoresSnapshot = {
	pagadores: DashboardPagador[];
	totalExpenses: number;
};

export async function fetchDashboardPagadores(
	userId: string,
	period: string,
): Promise<DashboardPagadoresSnapshot> {
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [period], {
		adminOnly: false,
	});
	const rows = rowsByPeriod.get(period) ?? [];

	const byPagador = new Map<string, number>();
	for (const row of rows) {
		const id = row.pagadorId ?? "";
		if (!id) continue;
		byPagador.set(id, (byPagador.get(id) ?? 0) + row.amount);
	}

	const pagadorIds = Array.from(byPagador.keys()).filter((id) => (byPagador.get(id) ?? 0) > 0);
	if (pagadorIds.length === 0) {
		return { pagadores: [], totalExpenses: 0 };
	}

	const pagadoresList = await db.query.pagadores.findMany({
		where: inArray(pagadores.id, pagadorIds),
		columns: {
			id: true,
			name: true,
			email: true,
			avatarUrl: true,
			role: true,
		},
	});

	const pagadoresWithTotals: DashboardPagador[] = pagadoresList
		.map((p) => ({
			id: p.id,
			name: p.name,
			email: p.email,
			avatarUrl: p.avatarUrl,
			totalExpenses: byPagador.get(p.id) ?? 0,
			isAdmin: p.role === PAGADOR_ROLE_ADMIN,
		}))
		.filter((p) => p.totalExpenses > 0)
		.sort((a, b) => b.totalExpenses - a.totalExpenses);

	const totalExpenses = pagadoresWithTotals.reduce(
		(sum, p) => sum + p.totalExpenses,
		0,
	);

	return {
		pagadores: pagadoresWithTotals,
		totalExpenses,
	};
}
