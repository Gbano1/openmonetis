import { CategoriesByTypePageContent } from "@/components/dashboard/categories-by-type-page-content";
import MonthNavigation from "@/components/month-picker/month-navigation";
import { getUser } from "@/lib/auth/server";
import { fetchIncomeByCategory } from "@/lib/dashboard/categories/income-by-category";
import { parsePeriodParam } from "@/lib/utils/period";

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

export default async function CategoriasReceitasPage({
	searchParams,
}: PageProps) {
	const user = await getUser();
	const resolved = searchParams ? await searchParams : undefined;
	const periodoParam = getSingleParam(resolved, "periodo");
	const { period } = parsePeriodParam(periodoParam);

	const data = await fetchIncomeByCategory(user.id, period);

	return (
		<main className="flex flex-col gap-6">
			<MonthNavigation />
			<CategoriesByTypePageContent
				type="receita"
				categories={data.categories}
				currentTotal={data.currentTotal}
				period={period}
				emptyTitle="Nenhuma receita encontrada"
				emptyDescription="Quando houver receitas registradas no período, elas aparecerão aqui."
			/>
		</main>
	);
}
