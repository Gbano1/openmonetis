import { RiArrowDownLine } from "@remixicon/react";
import PageDescription from "@/components/page-description";

export const metadata = {
	title: "Despesas do período | OpenMonetis",
	description:
		"Lista das despesas contabilizadas no dashboard para o período selecionado",
};

export default function DashboardDespesasLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-6 px-4 sm:px-6">
			<PageDescription
				icon={<RiArrowDownLine />}
				title="Despesas do período"
				subtitle="Despesas contabilizadas no total do dashboard (cartão pelo ciclo de fechamento)"
			/>
			{children}
		</section>
	);
}
