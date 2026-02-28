import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { cartoes, faturas, lancamentos, pagadores } from "@/db/schema";
import { ACCOUNT_AUTO_INVOICE_NOTE_PREFIX } from "@/lib/accounts/constants";
import { toNumber } from "@/lib/dashboard/common";
import { db } from "@/lib/db";
import {
	INVOICE_PAYMENT_STATUS,
	INVOICE_STATUS_VALUES,
	type InvoicePaymentStatus,
} from "@/lib/faturas";
import { getInvoiceDateRange } from "@/lib/utils/period";

type RawDashboardInvoice = {
	invoiceId: string | null;
	cardId: string;
	cardName: string;
	cardBrand: string | null;
	cardStatus: string | null;
	logo: string | null;
	dueDay: string;
	period: string | null;
	paymentStatus: string | null;
	totalAmount: string | number | null;
	transactionCount: string | number | null;
	invoiceCreatedAt: Date | null;
};

export type InvoicePagadorBreakdown = {
	pagadorId: string | null;
	pagadorName: string;
	pagadorAvatar: string | null;
	amount: number;
};

export type DashboardInvoice = {
	id: string;
	cardId: string;
	cardName: string;
	cardBrand: string | null;
	cardStatus: string | null;
	logo: string | null;
	dueDay: string;
	period: string;
	paymentStatus: InvoicePaymentStatus;
	totalAmount: number;
	paidAt: string | null;
	pagadorBreakdown: InvoicePagadorBreakdown[];
};

export type DashboardInvoicesSnapshot = {
	invoices: DashboardInvoice[];
	totalPending: number;
};

const toISODate = (value: Date | string | null | undefined) => {
	if (!value) {
		return null;
	}

	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}

	if (typeof value === "string") {
		return value.slice(0, 10);
	}

	return null;
};

const isInvoiceStatus = (value: unknown): value is InvoicePaymentStatus =>
	typeof value === "string" &&
	(INVOICE_STATUS_VALUES as string[]).includes(value);

const buildFallbackId = (cardId: string, period: string) =>
	`${cardId}:${period}`;

export async function fetchDashboardInvoices(
	userId: string,
	period: string,
): Promise<DashboardInvoicesSnapshot> {
	const paymentRows = await db
		.select({
			note: lancamentos.note,
			purchaseDate: lancamentos.purchaseDate,
			createdAt: lancamentos.createdAt,
		})
		.from(lancamentos)
		.where(
			and(
				eq(lancamentos.userId, userId),
				ilike(lancamentos.note, `${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`),
			),
		);

	const paymentMap = new Map<string, string>();
	for (const row of paymentRows) {
		const note = row.note;
		if (!note || !note.startsWith(ACCOUNT_AUTO_INVOICE_NOTE_PREFIX)) {
			continue;
		}
		const parts = note.split(":");
		if (parts.length < 3) {
			continue;
		}
		const cardIdPart = parts[1];
		const periodPart = parts[2];
		if (!cardIdPart || !periodPart) {
			continue;
		}
		const key = `${cardIdPart}:${periodPart}`;
		const resolvedDate =
			row.purchaseDate instanceof Date &&
			!Number.isNaN(row.purchaseDate.valueOf())
				? row.purchaseDate
				: row.createdAt;
		const isoDate = toISODate(resolvedDate);
		if (!isoDate) {
			continue;
		}
		const existing = paymentMap.get(key);
		if (!existing || existing < isoDate) {
			paymentMap.set(key, isoDate);
		}
	}

	// Lista de cartões com status da fatura do período (total da fatura por ciclo de fechamento)
	const cardRows = await db
		.select({
			invoiceId: faturas.id,
			cardId: cartoes.id,
			cardName: cartoes.name,
			cardBrand: cartoes.brand,
			cardStatus: cartoes.status,
			logo: cartoes.logo,
			dueDay: cartoes.dueDay,
			closingDay: cartoes.closingDay,
			period: faturas.period,
			paymentStatus: faturas.paymentStatus,
			invoiceCreatedAt: faturas.createdAt,
		})
		.from(cartoes)
		.leftJoin(
			faturas,
			and(
				eq(faturas.cartaoId, cartoes.id),
				eq(faturas.userId, userId),
				eq(faturas.period, period),
			),
		)
		.where(eq(cartoes.userId, userId));

	const rows: RawDashboardInvoice[] = [];
	const breakdownMap = new Map<string, InvoicePagadorBreakdown[]>();

	for (const card of cardRows) {
		const closingDayNum = Math.min(
			31,
			Math.max(1, Number.parseInt(card.closingDay ?? "1", 10) || 1),
		);
		const { start: invoiceStart, end: invoiceEnd } = getInvoiceDateRange(
			period,
			closingDayNum,
		);

		const [totalRow, breakdownRowsForCard] = await Promise.all([
			db
				.select({
					totalAmount: sql<number>`COALESCE(SUM(${lancamentos.amount}), 0)`,
					transactionCount: sql<number>`COUNT(${lancamentos.id})`,
				})
				.from(lancamentos)
				.where(
					and(
						eq(lancamentos.userId, userId),
						eq(lancamentos.cartaoId, card.cardId),
						gte(lancamentos.purchaseDate, invoiceStart),
						lte(lancamentos.purchaseDate, invoiceEnd),
					),
				),
			db
				.select({
					pagadorId: lancamentos.pagadorId,
					pagadorName: pagadores.name,
					pagadorAvatar: pagadores.avatarUrl,
					amount: sql<number>`coalesce(sum(${lancamentos.amount}), 0)`,
				})
				.from(lancamentos)
				.leftJoin(pagadores, eq(lancamentos.pagadorId, pagadores.id))
				.where(
					and(
						eq(lancamentos.userId, userId),
						eq(lancamentos.cartaoId, card.cardId),
						gte(lancamentos.purchaseDate, invoiceStart),
						lte(lancamentos.purchaseDate, invoiceEnd),
					),
				)
				.groupBy(
					lancamentos.pagadorId,
					pagadores.name,
					pagadores.avatarUrl,
				),
		]);

		const totalAmount = toNumber(totalRow[0]?.totalAmount ?? 0);
		const transactionCount = toNumber(totalRow[0]?.transactionCount ?? 0);

		rows.push({
			invoiceId: card.invoiceId,
			cardId: card.cardId,
			cardName: card.cardName,
			cardBrand: card.cardBrand,
			cardStatus: card.cardStatus,
			logo: card.logo,
			dueDay: card.dueDay,
			period: card.period ?? period,
			paymentStatus: card.paymentStatus,
			invoiceCreatedAt: card.invoiceCreatedAt,
			totalAmount,
			transactionCount,
		});

		const key = `${card.cardId}:${card.period ?? period}`;
		const breakdown: InvoicePagadorBreakdown[] = breakdownRowsForCard
			.filter((r) => Math.abs(toNumber(r.amount)) > 0)
			.map((r) => ({
				pagadorId: r.pagadorId ?? null,
				pagadorName: r.pagadorName?.trim() || "Sem pagador",
				pagadorAvatar: r.pagadorAvatar ?? null,
				amount: Math.abs(toNumber(r.amount)),
			}));
		breakdownMap.set(key, breakdown.sort((a, b) => b.amount - a.amount));
	}

	const invoices = rows
		.map((row: RawDashboardInvoice | null) => {
			if (!row) return null;

			const totalAmount = toNumber(row.totalAmount);
			const transactionCount = toNumber(row.transactionCount);
			const paymentStatus = isInvoiceStatus(row.paymentStatus)
				? row.paymentStatus
				: INVOICE_PAYMENT_STATUS.PENDING;

			const shouldInclude =
				transactionCount > 0 ||
				Math.abs(totalAmount) > 0 ||
				row.invoiceId !== null;

			if (!shouldInclude) {
				return null;
			}

			const resolvedPeriod = row.period ?? period;
			const paymentKey = `${row.cardId}:${resolvedPeriod}`;
			const paidAt =
				paymentStatus === INVOICE_PAYMENT_STATUS.PAID
					? (paymentMap.get(paymentKey) ?? toISODate(row.invoiceCreatedAt))
					: null;

			return {
				id: row.invoiceId ?? buildFallbackId(row.cardId, period),
				cardId: row.cardId,
				cardName: row.cardName,
				cardBrand: row.cardBrand,
				cardStatus: row.cardStatus,
				logo: row.logo,
				dueDay: row.dueDay,
				period: resolvedPeriod,
				paymentStatus,
				totalAmount,
				paidAt,
				pagadorBreakdown: (
					breakdownMap.get(`${row.cardId}:${resolvedPeriod}`) ?? []
				).sort((a, b) => b.amount - a.amount),
			} satisfies DashboardInvoice;
		})
		.filter((invoice): invoice is DashboardInvoice => invoice !== null)
		.sort((a, b) => {
			// Ordena do maior valor para o menor
			return Math.abs(b.totalAmount) - Math.abs(a.totalAmount);
		});

	const totalPending = invoices.reduce((total, invoice) => {
		if (invoice.paymentStatus !== INVOICE_PAYMENT_STATUS.PENDING) {
			return total;
		}
		return total + invoice.totalAmount;
	}, 0);

	return {
		invoices,
		totalPending,
	};
}
