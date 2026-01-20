import PageDescription from "@/components/page-description";
import { RiBankCard2Line } from "@remixicon/react";

export const metadata = {
  title: "Relatório de Cartões | Opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 px-6">
      <PageDescription
        icon={<RiBankCard2Line />}
        title="Relatório de Cartões"
        subtitle="Análise detalhada do uso dos seus cartões de crédito."
      />
      {children}
    </section>
  );
}
