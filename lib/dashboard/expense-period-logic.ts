import { getInvoiceDateRange } from "@/lib/utils/period";

export type CartoesMap = Map<string, number>;

export type ExpenseRowForPeriod = {
	period: string | null;
	purchaseDate: Date | string;
	cartaoId: string | null;
};

/**
 * Indica se uma despesa pertence ao período alvo.
 * - Sem cartão: pelo period do lançamento.
 * - Com cartão: pela data de compra dentro do intervalo da fatura (getInvoiceDateRange).
 */
export function belongsToPeriod(
	row: ExpenseRowForPeriod,
	targetPeriod: string,
	cartoesMap: CartoesMap,
): boolean {
	if (!row.cartaoId) {
		return row.period === targetPeriod;
	}
	const closingDay = cartoesMap.get(row.cartaoId);
	if (closingDay === undefined) {
		return row.period === targetPeriod;
	}
	const range = getInvoiceDateRange(targetPeriod, closingDay);
	const purchaseDate = parsePurchaseDate(row.purchaseDate);
	const start = range.start.getTime();
	const end = range.end.getTime();
	const t = purchaseDate.getTime();
	return t >= start && t <= end;
}

export function parsePurchaseDate(raw: Date | string): Date {
	if (raw instanceof Date) return raw;
	const s = String(raw).slice(0, 10);
	const [y, m, d] = s.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
