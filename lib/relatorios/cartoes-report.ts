import { and, eq, gte, ilike, inArray, lte, not } from "drizzle-orm";
import { cartoes, categorias, faturas } from "@/db/schema";
import { fetchExpenseRowsForPeriods } from "@/lib/dashboard/expense-rows-for-period";
import { parsePurchaseDate } from "@/lib/dashboard/expense-period-logic";
import { db } from "@/lib/db";
import { safeToNumber } from "@/lib/utils/number";
import { getPreviousPeriod } from "@/lib/utils/period";

export type CardSummary = {
	id: string;
	name: string;
	brand: string | null;
	logo: string | null;
	limit: number;
	currentUsage: number;
	usagePercent: number;
	previousUsage: number;
	changePercent: number;
	trend: "up" | "down" | "stable";
	status: string;
};

export type CardDetailData = {
	card: CardSummary;
	monthlyUsage: {
		period: string;
		periodLabel: string;
		amount: number;
	}[];
	categoryBreakdown: {
		id: string;
		name: string;
		icon: string | null;
		amount: number;
		percent: number;
	}[];
	topExpenses: {
		id: string;
		name: string;
		amount: number;
		date: string;
		category: string | null;
	}[];
	invoiceStatus: {
		period: string;
		status: string | null;
		amount: number;
	}[];
};

export type CartoesReportData = {
	cards: CardSummary[];
	totalLimit: number;
	totalUsage: number;
	totalUsagePercent: number;
	selectedCard: CardDetailData | null;
};

export async function fetchCartoesReportData(
	userId: string,
	currentPeriod: string,
	selectedCartaoId?: string | null,
): Promise<CartoesReportData> {
	const previousPeriod = getPreviousPeriod(currentPeriod);

	// Fetch all active cards (not inactive)
	const allCards = await db
		.select({
			id: cartoes.id,
			name: cartoes.name,
			brand: cartoes.brand,
			logo: cartoes.logo,
			limit: cartoes.limit,
			status: cartoes.status,
		})
		.from(cartoes)
		.where(
			and(eq(cartoes.userId, userId), not(ilike(cartoes.status, "inativo"))),
		);

	if (allCards.length === 0) {
		return {
			cards: [],
			totalLimit: 0,
			totalUsage: 0,
			totalUsagePercent: 0,
			selectedCard: null,
		};
	}

	const cardIds = allCards.map((c) => c.id);

	// Uso por cartão pelo ciclo de fatura (data de compra no intervalo de fechamento), não por period
	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, [
		currentPeriod,
		previousPeriod,
	], { adminOnly: true });

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const currentUsageMap = new Map<string, number>();
	for (const row of rowsByPeriod.get(currentPeriod) ?? []) {
		if (!row.cartaoId || !cardIds.includes(row.cartaoId)) continue;
		if (row.condition === "Recorrente" && parsePurchaseDate(row.purchaseDate).getTime() > today.getTime()) continue;
		currentUsageMap.set(row.cartaoId, (currentUsageMap.get(row.cartaoId) ?? 0) + row.amount);
	}

	const previousUsageMap = new Map<string, number>();
	for (const row of rowsByPeriod.get(previousPeriod) ?? []) {
		if (!row.cartaoId || !cardIds.includes(row.cartaoId)) continue;
		previousUsageMap.set(row.cartaoId, (previousUsageMap.get(row.cartaoId) ?? 0) + row.amount);
	}

	// Build card summaries
	const cards: CardSummary[] = allCards.map((card) => {
		const limit = safeToNumber(card.limit);
		const currentUsage = currentUsageMap.get(card.id) || 0;
		const previousUsage = previousUsageMap.get(card.id) || 0;
		const usagePercent = limit > 0 ? (currentUsage / limit) * 100 : 0;

		let changePercent = 0;
		let trend: "up" | "down" | "stable" = "stable";
		if (previousUsage > 0) {
			changePercent = ((currentUsage - previousUsage) / previousUsage) * 100;
			if (changePercent > 5) trend = "up";
			else if (changePercent < -5) trend = "down";
		} else if (currentUsage > 0) {
			changePercent = 100;
			trend = "up";
		}

		return {
			id: card.id,
			name: card.name,
			brand: card.brand,
			logo: card.logo,
			limit,
			currentUsage,
			usagePercent,
			previousUsage,
			changePercent,
			trend,
			status: card.status,
		};
	});

	// Sort cards by usage (descending)
	cards.sort((a, b) => b.currentUsage - a.currentUsage);

	// Calculate totals
	const totalLimit = cards.reduce((acc, c) => acc + c.limit, 0);
	const totalUsage = cards.reduce((acc, c) => acc + c.currentUsage, 0);
	const totalUsagePercent =
		totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0;

	// Fetch selected card details if provided
	let selectedCard: CardDetailData | null = null;
	const targetCardId =
		selectedCartaoId || (cards.length > 0 ? cards[0].id : null);

	if (targetCardId) {
		const cardSummary = cards.find((c) => c.id === targetCardId);
		if (cardSummary) {
			selectedCard = await fetchCardDetail(
				userId,
				targetCardId,
				cardSummary,
				currentPeriod,
			);
		}
	}

	return {
		cards,
		totalLimit,
		totalUsage,
		totalUsagePercent,
		selectedCard,
	};
}

async function fetchCardDetail(
	userId: string,
	cardId: string,
	cardSummary: CardSummary,
	currentPeriod: string,
): Promise<CardDetailData> {
	// Últimos 12 meses para gráfico e fatura; uso por ciclo de fatura do cartão
	const periods: string[] = [];
	let p = currentPeriod;
	for (let i = 0; i < 12; i++) {
		periods.unshift(p);
		p = getPreviousPeriod(p);
	}

	const startPeriod = periods[0];

	const monthLabels = [
		"Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
		"Jul", "Ago", "Set", "Out", "Nov", "Dez",
	];

	const { rowsByPeriod } = await fetchExpenseRowsForPeriods(userId, periods, {
		adminOnly: true,
	});

	// Uso mensal por período (ciclo do cartão)
	const monthlyUsage = periods.map((period) => {
		const rows = (rowsByPeriod.get(period) ?? []).filter(
			(row) => row.cartaoId === cardId,
		);
		const amount = rows.reduce((s, r) => s + r.amount, 0);
		const [year, month] = period.split("-");
		return {
			period,
			periodLabel: `${monthLabels[parseInt(month, 10) - 1]}/${year.slice(2)}`,
			amount,
		};
	});

	// Despesas do período atual (ciclo) para este cartão
	const currentRows = (rowsByPeriod.get(currentPeriod) ?? []).filter(
		(row) => row.cartaoId === cardId,
	);

	// Agrupar por categoria
	const byCategoria = new Map<string, number>();
	for (const row of currentRows) {
		const id = row.categoriaId ?? "sem-categoria";
		byCategoria.set(id, (byCategoria.get(id) ?? 0) + row.amount);
	}

	const totalCategoryAmount = currentRows.reduce((s, r) => s + r.amount, 0);
	const categoryIds = [...byCategoria.keys()].filter((id) => id !== "sem-categoria");

	const categoryNames =
		categoryIds.length > 0
			? await db
					.select({
						id: categorias.id,
						name: categorias.name,
						icon: categorias.icon,
					})
					.from(categorias)
					.where(inArray(categorias.id, categoryIds))
			: [];

	const categoryNameMap = new Map(categoryNames.map((c) => [c.id, c]));

	const categoryBreakdown = [...byCategoria.entries()]
		.map(([id, amount]) => ({
			id,
			name: id === "sem-categoria" ? "Sem categoria" : (categoryNameMap.get(id)?.name ?? "Sem categoria"),
			icon: id === "sem-categoria" ? null : (categoryNameMap.get(id)?.icon ?? null),
			amount,
			percent: totalCategoryAmount > 0 ? (amount / totalCategoryAmount) * 100 : 0,
		}))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 10);

	// Top 10 despesas (maiores valores primeiro)
	const topExpenses = [...currentRows]
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 10)
		.map((row) => {
			const catInfo = row.categoriaId ? categoryNameMap.get(row.categoriaId) : null;
			return {
				id: row.id,
				name: row.name ?? "",
				amount: row.amount,
				date: row.purchaseDate
					? (typeof row.purchaseDate === "string"
						? new Date(row.purchaseDate)
						: row.purchaseDate
					).toLocaleDateString("pt-BR")
					: "",
				category: catInfo?.name ?? null,
			};
		});

	// Status das faturas; valor exibido = uso do período (já por ciclo)
	const invoiceData = await db
		.select({
			period: faturas.period,
			status: faturas.paymentStatus,
		})
		.from(faturas)
		.where(
			and(
				eq(faturas.userId, userId),
				eq(faturas.cartaoId, cardId),
				gte(faturas.period, startPeriod),
				lte(faturas.period, currentPeriod),
			),
		)
		.orderBy(faturas.period);

	const invoiceStatus = periods.map((period) => {
		const invoice = invoiceData.find((i) => i.period === period);
		const usage = monthlyUsage.find((m) => m.period === period);
		return {
			period,
			status: invoice?.status ?? null,
			amount: usage?.amount ?? 0,
		};
	});

	return {
		card: cardSummary,
		monthlyUsage,
		categoryBreakdown,
		topExpenses,
		invoiceStatus,
	};
}
