"use client";

import { RiPriceTag3Line } from "@remixicon/react";
import { CategoryIconBadge } from "@/components/categorias/category-icon-badge";
import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetEmptyState } from "@/components/widget-empty-state";
import type { TopEstabelecimentosData } from "@/lib/top-estabelecimentos/fetch-data";
import { Progress } from "../ui/progress";

type TopCategoriesProps = {
	categories: TopEstabelecimentosData["topCategories"];
};

export function TopCategories({ categories }: TopCategoriesProps) {
	if (categories.length === 0) {
		return (
			<Card className="h-full min-w-0">
				<CardHeader className="pb-3 px-3 sm:px-6">
					<CardTitle className="flex items-center gap-1.5 text-base">
						<RiPriceTag3Line className="size-4 text-primary" />
						Principais Categorias
					</CardTitle>
				</CardHeader>
				<CardContent className="px-3 sm:px-6">
					<WidgetEmptyState
						icon={<RiPriceTag3Line className="size-6 text-muted-foreground" />}
						title="Nenhuma categoria encontrada"
						description="Quando houver despesas categorizadas, elas aparecerão aqui."
					/>
				</CardContent>
			</Card>
		);
	}

	const totalAmount = categories.reduce((acc, c) => acc + c.totalAmount, 0);

	return (
		<Card className="h-full min-w-0 overflow-hidden">
			<CardHeader className="pb-3 px-3 sm:px-6">
				<CardTitle className="flex items-center gap-1.5 text-base">
					<RiPriceTag3Line className="size-4 shrink-0 text-primary" />
					<span className="truncate">Principais Categorias</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 px-3 sm:px-6">
				<div className="flex flex-col min-w-0">
					{categories.map((category, index) => {
						const percent =
							totalAmount > 0 ? (category.totalAmount / totalAmount) * 100 : 0;

						return (
							<div
								key={category.id}
								className="flex flex-col py-2 sm:py-2.5 border-b border-dashed last:border-0"
							>
								<div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
									<div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
										<CategoryIconBadge
											icon={category.icon}
											name={category.name}
											colorIndex={index}
										/>

										<div className="min-w-0 flex-1">
											<span className="text-sm font-medium truncate block">
												{category.name}
											</span>
											<span className="text-xs text-muted-foreground">
												{percent.toFixed(0)}% do total •{" "}
												{category.transactionCount}x
											</span>
										</div>
									</div>

									<div className="flex shrink-0 flex-col items-end text-right">
										<MoneyValues
											className="text-foreground text-sm sm:text-base"
											amount={category.totalAmount}
										/>
									</div>
								</div>

								<div className="ml-10 sm:ml-11 mt-1.5">
									<Progress className="h-1.5" value={percent} />
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
