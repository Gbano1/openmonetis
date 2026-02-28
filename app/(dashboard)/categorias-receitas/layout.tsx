import { RiPieChartLine } from "@remixicon/react";
import PageDescription from "@/components/page-description";

export const metadata = {
	title: "Categorias por Receitas | OpenMonetis",
	description: "Distribuição de receitas por categoria com gráfico e detalhamento",
};

export default function CategoriasReceitasLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-6 px-4 sm:px-6">
			<PageDescription
				icon={<RiPieChartLine />}
				title="Categorias por Receitas"
				subtitle="Distribuição de receitas por categoria com gráfico e lista detalhada"
			/>
			{children}
		</section>
	);
}
