import MonthNavigation from "@/components/month-picker/month-navigation";
import { CardCategoryBreakdown } from "@/components/relatorios/cartoes/card-category-breakdown";
import { CardInvoiceStatus } from "@/components/relatorios/cartoes/card-invoice-status";
import { CardTopExpenses } from "@/components/relatorios/cartoes/card-top-expenses";
import { CardUsageChart } from "@/components/relatorios/cartoes/card-usage-chart";
import { CardsOverview } from "@/components/relatorios/cartoes/cards-overview";
import { getUser } from "@/lib/auth/server";
import { fetchCartoesReportData } from "@/lib/relatorios/cartoes-report";
import { parsePeriodParam } from "@/lib/utils/period";
import { RiBankCard2Line } from "@remixicon/react";

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

export default async function RelatorioCartoesPage({
  searchParams,
}: PageProps) {
  const user = await getUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const periodoParam = getSingleParam(resolvedSearchParams, "periodo");
  const cartaoParam = getSingleParam(resolvedSearchParams, "cartao");
  const { period: selectedPeriod } = parsePeriodParam(periodoParam);

  const data = await fetchCartoesReportData(
    user.id,
    selectedPeriod,
    cartaoParam,
  );

  return (
    <main className="flex flex-col gap-4">
      <MonthNavigation />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CardsOverview data={data} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          {data.selectedCard ? (
            <>
              <CardUsageChart
                data={data.selectedCard.monthlyUsage}
                limit={data.selectedCard.card.limit}
                card={{
                  name: data.selectedCard.card.name,
                  logo: data.selectedCard.card.logo,
                }}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <CardCategoryBreakdown
                  data={data.selectedCard.categoryBreakdown}
                />
                <CardTopExpenses data={data.selectedCard.topExpenses} />
              </div>

              <CardInvoiceStatus data={data.selectedCard.invoiceStatus} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <RiBankCard2Line className="size-12 mb-4" />
              <p className="text-lg font-medium">Nenhum cartão selecionado</p>
              <p className="text-sm">
                Selecione um cartão na lista ao lado para ver detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
