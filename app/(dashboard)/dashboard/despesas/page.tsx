import MonthNavigation from "@/components/month-picker/month-navigation";
import { getUser } from "@/lib/auth/server";
import { fetchDashboardExpensesForPeriod } from "@/lib/dashboard/expenses-periodo-list";
import Link from "next/link";
import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardExpenseItem } from "@/lib/dashboard/expenses-periodo-list";
import { displayPeriod, parsePeriodParam } from "@/lib/utils/period";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
	searchParams?: PageSearchParams;
};

const getSingleParam = (
	params: Record<string, string | string[] | undefined> | undefined,
	key: string,
) => {
	const value = params?.[key];
	if (!value) return null;
	return Array.isArray(value) ? (value[0] ?? null) : value;
};

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(d);
}

export default async function DashboardDespesasPage({
	searchParams,
}: PageProps) {
	const user = await getUser();
	const resolved = searchParams ? await searchParams : undefined;
	const periodoParam = getSingleParam(resolved, "periodo");
	const { period } = parsePeriodParam(periodoParam);

	const { expenses, total } = await fetchDashboardExpensesForPeriod(
		user.id,
		period,
	);

	const periodLabel = displayPeriod(period);

	return (
		<main className="flex flex-col gap-6">
			<MonthNavigation />
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-lg">
						Total contabilizado:{" "}
						<MoneyValues className="text-primary" amount={total} />
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						{periodLabel} — {expenses.length}{" "}
						{expenses.length === 1 ? "despesa" : "despesas"}
					</p>
				</CardHeader>
				<CardContent>
					{expenses.length === 0 ? (
						<p className="text-sm text-muted-foreground py-8 text-center">
							Nenhuma despesa contabilizada neste período.
						</p>
					) : (
						<div className="overflow-x-auto -mx-2 sm:mx-0">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b text-left text-muted-foreground">
										<th className="py-3 px-2 font-medium">Data</th>
										<th className="py-3 px-2 font-medium">Nome</th>
										<th className="py-3 px-2 font-medium hidden sm:table-cell">
											Categoria
										</th>
										<th className="py-3 px-2 font-medium hidden @md/main:table-cell">
											Conta / Cartão
										</th>
										<th className="py-3 px-2 font-medium text-right">Valor</th>
									</tr>
								</thead>
								<tbody>
									{expenses.map((exp) => (
										<ExpenseRow key={exp.id} expense={exp} />
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}

function ExpenseRow({ expense }: { expense: DashboardExpenseItem }) {
	return (
		<tr className="border-b border-dashed last:border-0 hover:bg-muted/40">
			<td className="py-2.5 px-2 whitespace-nowrap text-muted-foreground">
				{formatDate(expense.purchaseDate)}
			</td>
			<td className="py-2.5 px-2 min-w-0">
				<Link
					href={`/lancamentos?lancamento=${expense.id}`}
					className="font-medium text-foreground hover:underline truncate block max-w-[200px] sm:max-w-none"
				>
					{expense.name}
				</Link>
			</td>
			<td className="py-2.5 px-2 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
				{expense.categoryName ?? "—"}
			</td>
			<td className="py-2.5 px-2 text-muted-foreground hidden @md/main:table-cell truncate max-w-[140px]">
				{expense.accountOrCardName ?? "—"}
			</td>
			<td className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
				<MoneyValues amount={-expense.amount} />
			</td>
		</tr>
	);
}
