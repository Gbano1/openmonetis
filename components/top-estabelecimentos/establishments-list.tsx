"use client";

import { RiStore2Line } from "@remixicon/react";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetEmptyState } from "@/components/widget-empty-state";
import type { TopEstabelecimentosData } from "@/lib/top-estabelecimentos/fetch-data";
import { Progress } from "../ui/progress";

type EstablishmentsListProps = {
	establishments: TopEstabelecimentosData["establishments"];
};

const buildInitials = (value: string) => {
	const parts = value.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "ES";
	if (parts.length === 1) {
		const firstPart = parts[0];
		return firstPart ? firstPart.slice(0, 2).toUpperCase() : "ES";
	}
	const firstChar = parts[0]?.[0] ?? "";
	const secondChar = parts[1]?.[0] ?? "";
	return `${firstChar}${secondChar}`.toUpperCase() || "ES";
};

export function EstablishmentsList({
	establishments,
}: EstablishmentsListProps) {
	if (establishments.length === 0) {
		return (
			<Card className="h-full min-w-0">
				<CardHeader className="pb-3 px-3 sm:px-6">
					<CardTitle className="flex items-center gap-1.5 text-base">
						<RiStore2Line className="size-4 text-primary" />
						Top Estabelecimentos
					</CardTitle>
				</CardHeader>
				<CardContent className="px-3 sm:px-6">
					<WidgetEmptyState
						icon={<RiStore2Line className="size-6 text-muted-foreground" />}
						title="Nenhum estabelecimento encontrado"
						description="Quando houver compras registradas, elas aparecerão aqui."
					/>
				</CardContent>
			</Card>
		);
	}

	const maxCount = Math.max(...establishments.map((e) => e.count));

	return (
		<Card className="h-full min-w-0 overflow-hidden">
			<CardHeader className="pb-3 px-3 sm:px-6">
				<CardTitle className="flex items-center gap-1.5 text-base">
					<RiStore2Line className="size-4 shrink-0 text-primary" />
					<span className="truncate">Top Estabelecimentos por Frequência</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 px-3 sm:px-6">
				<div className="flex flex-col min-w-0">
					{establishments.map((establishment, index) => {
						return (
							<div
								key={establishment.name}
								className="flex flex-col py-2 sm:py-2.5 border-b border-dashed last:border-0"
							>
								<div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
									<div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
										<div className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-muted">
											<span className="text-xs sm:text-sm font-semibold text-muted-foreground">
												{index + 1}
											</span>
										</div>

										<div className="min-w-0 flex-1">
											<span className="text-sm font-medium truncate block">
												{establishment.name}
											</span>
											<div className="flex items-center gap-1 mt-0.5 flex-wrap">
												{establishment.categories
													.slice(0, 2)
													.map((cat, catIndex) => (
														<Badge
															key={catIndex}
															variant="secondary"
															className="text-xs px-1.5 py-0 h-5"
														>
															{cat.name}
														</Badge>
													))}
											</div>
										</div>
									</div>

									<div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
										<MoneyValues
											className="text-foreground text-sm sm:text-base"
											amount={establishment.totalAmount}
										/>
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{establishment.count}x • Média:{" "}
											<MoneyValues
												className="text-xs"
												amount={establishment.avgAmount}
											/>
										</span>
									</div>
								</div>

								<div className="ml-10 sm:ml-11 mt-1.5">
									<Progress
										className="h-1.5"
										value={(establishment.count / maxCount) * 100}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
