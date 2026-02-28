"use client";

import {
	RiExchangeLine,
	RiMoneyDollarCircleLine,
	RiRepeatLine,
	RiStore2Line,
} from "@remixicon/react";
import MoneyValues from "@/components/money-values";
import { Card, CardContent } from "@/components/ui/card";
import type { TopEstabelecimentosData } from "@/lib/top-estabelecimentos/fetch-data";

type SummaryCardsProps = {
	summary: TopEstabelecimentosData["summary"];
};

export function SummaryCards({ summary }: SummaryCardsProps) {
	const cards = [
		{
			title: "Estabelecimentos",
			value: summary.totalEstablishments,
			isMoney: false,
			icon: RiStore2Line,
			description: "Locais diferentes",
		},
		{
			title: "Transações",
			value: summary.totalTransactions,
			isMoney: false,
			icon: RiExchangeLine,
			description: "Compras no período",
		},
		{
			title: "Total Gasto",
			value: summary.totalSpent,
			isMoney: true,
			icon: RiMoneyDollarCircleLine,
			description: "Soma de todas as compras",
		},
		{
			title: "Ticket Médio",
			value: summary.avgPerTransaction,
			isMoney: true,
			icon: RiRepeatLine,
			description: "Média por transação",
		},
	];

	return (
		<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.title} className="min-w-0">
					<CardContent className="px-3 py-3 sm:px-4 sm:py-2">
						<div className="flex items-start justify-between gap-3 min-w-0">
							<div className="space-y-1 min-w-0 flex-1">
								<p className="text-xs font-medium text-muted-foreground">
									{card.title}
								</p>
								{card.isMoney ? (
									<MoneyValues
										className="text-xl font-semibold sm:text-2xl"
										amount={card.value}
									/>
								) : (
									<p className="text-xl font-semibold sm:text-2xl">{card.value}</p>
								)}
								<p className="text-xs text-muted-foreground">
									{card.description}
								</p>
							</div>
							<card.icon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
