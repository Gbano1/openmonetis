import { RiPieChartLine } from "@remixicon/react";
import PageDescription from "@/components/page-description";

export const metadata = {
	title: "Categorias por Despesas | OpenMonetis",
	description: "Distribuição de despesas por categoria com gráfico e detalhamento",
};

export default function CategoriasDespesasLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-6 px-4 sm:px-6">
			<PageDescription
				icon={<RiPieChartLine />}
				title="Categorias por Despesas"
				subtitle="Distribuição de despesas por categoria com gráfico e lista detalhada"
			/>
			{children}
		</section>
	);
}
