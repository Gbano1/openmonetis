import {
	RiArrowDownLine,
	RiArrowDownSFill,
	RiArrowUpLine,
	RiArrowUpSFill,
	RiCashLine,
	RiIncreaseDecreaseLine,
	RiSubtractLine,
} from "@remixicon/react";
import Link from "next/link";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DashboardCardMetrics } from "@/lib/dashboard/metrics";
import { formatPeriodForUrl } from "@/lib/utils/period";
import MoneyValues from "../money-values";

type SectionCardsProps = {
	metrics: DashboardCardMetrics;
	period: string;
};

type Trend = "up" | "down" | "flat";

const TREND_THRESHOLD = 0.005;

const CARDS = [
	{
		label: "Receitas",
		key: "receitas",
		icon: RiArrowUpLine,
		invertTrend: false,
	},
	{
		label: "Despesas",
		key: "despesas",
		icon: RiArrowDownLine,
		invertTrend: true,
	},
	{
		label: "Balanço",
		key: "balanco",
		icon: RiIncreaseDecreaseLine,
		invertTrend: false,
	},
	{ label: "Previsto", key: "previsto", icon: RiCashLine, invertTrend: false },
] as const;

const TREND_ICONS = {
	up: RiArrowUpSFill,
	down: RiArrowDownSFill,
	flat: RiSubtractLine,
} as const;

const getTrend = (current: number, previous: number): Trend => {
	const diff = current - previous;
	if (diff > TREND_THRESHOLD) return "up";
	if (diff < -TREND_THRESHOLD) return "down";
	return "flat";
};

const getPercentChange = (current: number, previous: number): string => {
	const EPSILON = 0.01; // Considera valores menores que 1 centavo como zero

	if (Math.abs(previous) < EPSILON) {
		if (Math.abs(current) < EPSILON) return "0%";
		return "—";
	}

	const change = ((current - previous) / Math.abs(previous)) * 100;
	return Number.isFinite(change) && Math.abs(change) < 1000000
		? `${change > 0 ? "+" : ""}${change.toFixed(1)}%`
		: "—";
};

const getTrendColor = (trend: Trend, invertTrend: boolean): string => {
	if (trend === "flat") return "";
	const isPositive = invertTrend ? trend === "down" : trend === "up";
	return isPositive
		? "text-success border-success"
		: "text-destructive border-destructive";
};

export function SectionCards({ metrics, period }: SectionCardsProps) {
	const periodParam = formatPeriodForUrl(period);

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{CARDS.map(({ label, key, icon: Icon, invertTrend }) => {
				const metric = metrics[key];
				const trend = getTrend(metric.current, metric.previous);
				const TrendIcon = TREND_ICONS[trend];
				const trendColor = getTrendColor(trend, invertTrend);
				const isDespesas = key === "despesas";
				const cardContent = (
					<>
						<CardHeader>
							<CardTitle className="flex items-center gap-1">
								<Icon className="size-4 text-primary" />
								{label}
							</CardTitle>
							<MoneyValues className="text-2xl" amount={metric.current} />
							<CardAction>
								<div className={`flex items-center text-xs ${trendColor}`}>
									<TrendIcon size={16} />
									{getPercentChange(metric.current, metric.previous)}
								</div>
							</CardAction>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-2 text-sm">
							<div className="line-clamp-1 flex gap-2 text-xs">
								Mês anterior
							</div>
							<div className="text-muted-foreground">
								<MoneyValues amount={metric.previous} />
							</div>
						</CardFooter>
					</>
				);

				if (isDespesas) {
					return (
						<Link
							key={label}
							href={`/dashboard/despesas?periodo=${periodParam}`}
							className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
							aria-label="Ver lista de despesas do período"
						>
							<Card className="@container/card gap-2 h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
								{cardContent}
							</Card>
						</Link>
					);
				}

				return (
					<Card key={label} className="@container/card gap-2">
						{cardContent}
					</Card>
				);
			})}
		</div>
	);
}
