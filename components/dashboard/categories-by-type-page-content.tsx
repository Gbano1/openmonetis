"use client";

import {
	RiArrowDownSFill,
	RiArrowUpSFill,
	RiBarChart2Line,
	RiExternalLinkLine,
	RiPieChartLine,
	RiWallet3Line,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { CategoryIconBadge } from "@/components/categorias/category-icon-badge";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getCategoryColor } from "@/lib/utils/category-colors";
import { formatPeriodForUrl } from "@/lib/utils/period";
import { cn } from "@/lib/utils";

const formatPercentage = (value: number, decimals = 1) =>
	`${Math.abs(value).toFixed(decimals)}%`;

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);

export type CategoryByTypeItem = {
	categoryId: string;
	categoryName: string;
	categoryIcon: string | null;
	currentAmount: number;
	percentageOfTotal: number;
	percentageChange: number | null;
	budgetAmount: number | null;
	budgetUsedPercentage: number | null;
};

type CategoriesByTypePageContentProps = {
	type: "receita" | "despesa";
	categories: CategoryByTypeItem[];
	currentTotal: number;
	period: string;
	emptyTitle: string;
	emptyDescription: string;
};


export function CategoriesByTypePageContent({
	type,
	categories,
	currentTotal,
	period,
	emptyTitle,
	emptyDescription,
}: CategoriesByTypePageContentProps) {
	const router = useRouter();
	const [chartVariant, setChartVariant] = useState<"bars" | "pie">("bars");
	const periodParam = formatPeriodForUrl(period);
	const isReceita = type === "receita";

	const handleCategoryClick = (categoryId: string) => {
		router.push(`/categorias/${categoryId}?periodo=${periodParam}`);
	};

	const chartData = useMemo(
		() =>
			categories.map((cat, i) => ({
				categoryId: cat.categoryId,
				name: cat.categoryName.length > 14
					? `${cat.categoryName.slice(0, 12)}…`
					: cat.categoryName,
				fullName: cat.categoryName,
				value: cat.currentAmount,
				percentage: cat.percentageOfTotal,
				fill: getCategoryColor(i),
			})),
		[categories],
	);

	const chartConfig = useMemo(() => {
		const config: ChartConfig = {};
		categories.forEach((cat, i) => {
			config[cat.categoryId] = {
				label: cat.categoryName,
				color: getCategoryColor(i),
			};
		});
		return config;
	}, [categories]);

	// Altura do gráfico horizontal: ~40px por categoria, com teto para não ficar gigante
	const barChartHeight = useMemo(
		() => Math.min(Math.max(240, chartData.length * 44), 420),
		[chartData.length],
	);

	if (categories.length === 0) {
		return (
			<Card className="border-0 shadow-none bg-muted/30">
				<CardContent className="flex flex-col items-center justify-center py-16">
					<div className="rounded-full bg-muted p-4 mb-4">
						<RiPieChartLine className="size-10 text-muted-foreground" />
					</div>
					<h3 className="font-semibold text-lg text-center">{emptyTitle}</h3>
					<p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
						{emptyDescription}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Gráfico com alternância Barras / Pizza */}
			<Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 transition-all duration-300 hover:shadow-xl min-w-0">
				<CardHeader className="pb-2 px-4 sm:px-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
						<div className="min-w-0">
							<CardTitle className="text-lg font-semibold">
								Distribuição por categoria
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-0.5">
								Total no período:{" "}
								<MoneyValues
									className="font-medium text-foreground"
									amount={currentTotal}
								/>
							</p>
						</div>
						<div className="flex rounded-lg border border-border bg-muted/50 p-0.5 w-full sm:w-auto shrink-0">
							<Button
								variant={chartVariant === "bars" ? "secondary" : "ghost"}
								size="sm"
								className={cn(
									"flex-1 sm:flex-initial gap-1.5 h-8 px-3 rounded-md transition-all",
									chartVariant === "bars" && "shadow-sm",
								)}
								onClick={() => setChartVariant("bars")}
							>
								<RiBarChart2Line className="size-4 shrink-0" />
								Barras
							</Button>
							<Button
								variant={chartVariant === "pie" ? "secondary" : "ghost"}
								size="sm"
								className={cn(
									"flex-1 sm:flex-initial gap-1.5 h-8 px-3 rounded-md transition-all",
									chartVariant === "pie" && "shadow-sm",
								)}
								onClick={() => setChartVariant("pie")}
							>
								<RiPieChartLine className="size-4 shrink-0" />
								Pizza
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0 px-2 sm:px-6">
					{chartVariant === "bars" && (
						<div
							key="bars"
							className="animate-in fade-in-0 duration-300 overflow-x-auto overflow-y-hidden min-w-0"
						>
							<div
								className="w-full min-w-0"
								style={{ height: barChartHeight }}
							>
								<ChartContainer
									config={chartConfig}
									className="h-full w-full"
								>
									<BarChart
										layout="vertical"
										data={chartData}
										margin={{ top: 8, right: 20, left: 12, bottom: 8 }}
										barCategoryGap={14}
										barGap={4}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											horizontal={false}
											className="opacity-50"
										/>
										<XAxis
											type="number"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											tick={{ fontSize: 11 }}
											tickFormatter={(v) =>
												v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
											}
										/>
										<YAxis
											type="category"
											dataKey="fullName"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											tick={{ fontSize: 12 }}
											width={112}
											className="text-muted-foreground"
											tickFormatter={(value: string) =>
												value.length > 16 ? `${value.slice(0, 14)}…` : value
											}
										/>
										<ChartTooltip
											content={({ active, payload }) => {
												if (!active || !payload?.length) return null;
												const d = payload[0].payload;
												return (
													<div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
														<p className="font-medium text-foreground truncate max-w-[220px]">
															{d.fullName}
														</p>
														<p className="text-sm text-muted-foreground">
															{formatPercentage(d.percentage)} do total
														</p>
														<p className="font-semibold text-foreground">
															{formatCurrency(d.value)}
														</p>
													</div>
												);
											}}
										/>
										<Bar
											dataKey="value"
											radius={[0, 6, 6, 0]}
											isAnimationActive
											animationDuration={500}
											animationEasing="ease-out"
											onClick={(arg: unknown) => {
												const payload =
													typeof arg === "object" && arg !== null && "categoryId" in arg
														? (arg as { categoryId: string })
														: typeof arg === "object" &&
																arg !== null &&
																"payload" in arg
																? (arg as { payload: { categoryId?: string } }).payload
																: null;
												const id = payload?.categoryId;
												if (id) handleCategoryClick(id);
											}}
											cursor="pointer"
										>
											{chartData.map((entry) => (
												<Cell key={entry.categoryId} fill={entry.fill} />
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>
					)}

					{chartVariant === "pie" && (
						<div
							key="pie"
							className="animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 min-w-0"
							style={{ minHeight: 280 }}
						>
							<ChartContainer
								config={chartConfig}
								className="h-[240px] sm:h-[300px] w-full max-w-[280px] sm:max-w-[320px] mx-auto shrink-0"
							>
								<PieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										innerRadius={64}
										outerRadius={100}
										paddingAngle={2}
										dataKey="value"
										nameKey="category"
										labelLine={false}
										label={false}
										isAnimationActive
										animationBegin={0}
										animationDuration={800}
										animationEasing="ease-out"
										onClick={(arg: unknown) => {
											const payload =
												typeof arg === "object" && arg !== null && "categoryId" in arg
													? (arg as { categoryId: string })
													: typeof arg === "object" &&
															arg !== null &&
															"payload" in arg
														? (arg as { payload: { categoryId?: string } }).payload
														: null;
											const id = payload?.categoryId;
											if (id) handleCategoryClick(id);
										}}
										cursor="pointer"
									>
										{chartData.map((entry) => (
											<Cell key={entry.categoryId} fill={entry.fill} />
										))}
									</Pie>
									<Tooltip
										content={({ active, payload }) => {
											if (!active || !payload?.length) return null;
											const d = payload[0].payload;
											return (
												<div className="rounded-xl border bg-background/95 backdrop-blur px-4 py-3 shadow-xl max-w-[90vw]">
													<p className="font-semibold text-foreground truncate max-w-[220px]">
														{d.fullName}
													</p>
													<p className="text-sm text-muted-foreground mt-0.5">
														{formatPercentage(d.percentage)} do total
													</p>
													<p className="font-bold text-foreground text-lg mt-1">
														{formatCurrency(d.value)}
													</p>
												</div>
											);
										}}
									/>
								</PieChart>
							</ChartContainer>
							<div className="flex flex-col gap-2.5 w-full min-w-0 px-1 sm:max-w-[220px] sm:flex-1">
								{chartData.map((entry, index) => (
									<div
										key={`legend-${entry.categoryId}`}
										className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-2 duration-300 min-w-0"
										style={{
											animationDelay: `${100 + index * 50}ms`,
										}}
									>
										<div
											className="size-4 rounded-md shrink-0 shadow-sm flex-shrink-0"
											style={{ backgroundColor: entry.fill }}
										/>
										<span className="text-sm text-muted-foreground break-words hyphens-auto min-w-0 flex-1">
											{entry.fullName}
										</span>
										<span className="text-sm font-medium tabular-nums text-foreground shrink-0">
											{formatPercentage(entry.percentage)}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Lista de categorias */}
			<Card className="overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm min-w-0">
				<CardHeader className="pb-3 px-4 sm:px-6">
					<CardTitle className="text-lg font-semibold">
						Detalhamento por categoria
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0 px-4 sm:px-6">
					<ul className="flex flex-col divide-y divide-dashed">
						{categories.map((category, index) => {
							const hasIncrease =
								category.percentageChange !== null &&
								category.percentageChange > 0;
							const hasDecrease =
								category.percentageChange !== null &&
								category.percentageChange < 0;
							const hasBudget = category.budgetAmount !== null;
							const budgetExceeded =
								hasBudget &&
								category.budgetUsedPercentage !== null &&
								category.budgetUsedPercentage > 100;
							const exceededAmount =
								budgetExceeded && category.budgetAmount
									? category.currentAmount - category.budgetAmount
									: 0;

							return (
								<li
									key={category.categoryId}
									className="py-4 first:pt-0 transition-all duration-300 ease-out hover:bg-muted/40 -mx-2 px-2 rounded-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
									style={{
										animationDelay: `${Math.min(index * 50, 500)}ms`,
									}}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex min-w-0 flex-1 items-center gap-3">
											<CategoryIconBadge
												icon={category.categoryIcon}
												name={category.categoryName}
												colorIndex={index}
											/>
											<div className="min-w-0 flex-1">
												<Link
													href={`/categorias/${category.categoryId}?periodo=${periodParam}`}
													className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-2 hover:underline"
												>
													<span className="truncate">
														{category.categoryName}
													</span>
													<RiExternalLinkLine className="size-3.5 shrink-0 text-muted-foreground" />
												</Link>
												<p className="text-xs text-muted-foreground mt-0.5">
													{formatPercentage(category.percentageOfTotal)}{" "}
													{isReceita ? "da receita" : "da despesa"} total
												</p>
											</div>
										</div>
										<div className="flex shrink-0 flex-col items-end gap-0.5">
											<MoneyValues
												className="text-foreground font-medium"
												amount={category.currentAmount}
											/>
											{category.percentageChange !== null && (
												<span
													className={`flex items-center gap-0.5 text-xs ${
														isReceita
															? hasIncrease
																? "text-success"
																: hasDecrease
																	? "text-destructive"
																	: "text-muted-foreground"
															: hasIncrease
																? "text-destructive"
																: hasDecrease
																	? "text-success"
																	: "text-muted-foreground"
													}`}
												>
													{hasIncrease && <RiArrowUpSFill className="size-3" />}
													{hasDecrease && (
														<RiArrowDownSFill className="size-3" />
													)}
													{formatPercentage(category.percentageChange)}
												</span>
											)}
										</div>
									</div>
									{hasBudget &&
										category.budgetUsedPercentage !== null &&
										category.budgetAmount !== null && (
											<div className="ml-12 mt-2 flex items-center gap-1.5 text-xs">
												<RiWallet3Line
													className={`size-3 ${
														budgetExceeded ? "text-destructive" : "text-info"
													}`}
												/>
												<span
													className={
														budgetExceeded ? "text-destructive" : "text-info"
													}
												>
													{budgetExceeded ? (
														<>
															{formatPercentage(category.budgetUsedPercentage)} do
															limite {formatCurrency(category.budgetAmount)} —
															excedeu em {formatCurrency(exceededAmount)}
														</>
													) : (
														<>
															{formatPercentage(category.budgetUsedPercentage)} do
															limite {formatCurrency(category.budgetAmount)}
														</>
													)}
												</span>
											</div>
										)}
								</li>
							);
						})}
					</ul>
				</CardContent>
			</Card>

		</div>
	);
}
