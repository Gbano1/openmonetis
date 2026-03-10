import { and, desc, eq, isNull, ne, or, type SQL } from "drizzle-orm";
import {
	cartoes,
	categorias,
	contas,
	lancamentos,
	pagadores,
} from "@/db/schema";
import { INITIAL_BALANCE_NOTE } from "@/lib/accounts/constants";
import { db } from "@/lib/db";

/**
 * Busca lançamentos para a aba /lancamentos.
 * Os filtros devem ser construídos com buildLancamentoWhere (apenas por mês — campo period).
 * Esta página não usa lógica de ciclo de fatura do cartão; dashboard e relatórios.
 */
export async function fetchLancamentos(filters: SQL[]) {
	const lancamentoRows = await db
		.select({
			lancamento: lancamentos,
			pagador: pagadores,
			conta: contas,
			cartao: cartoes,
			categoria: categorias,
		})
		.from(lancamentos)
		.leftJoin(pagadores, eq(lancamentos.pagadorId, pagadores.id))
		.leftJoin(contas, eq(lancamentos.contaId, contas.id))
		.leftJoin(cartoes, eq(lancamentos.cartaoId, cartoes.id))
		.leftJoin(categorias, eq(lancamentos.categoriaId, categorias.id))
		.where(
			and(
				...filters,
				// Excluir saldos iniciais de contas que têm excludeInitialBalanceFromIncome = true
				or(
					ne(lancamentos.note, INITIAL_BALANCE_NOTE),
					isNull(contas.excludeInitialBalanceFromIncome),
					eq(contas.excludeInitialBalanceFromIncome, false),
				),
			),
		)
		.orderBy(desc(lancamentos.purchaseDate), desc(lancamentos.createdAt));

	// Transformar resultado para o formato esperado
	return lancamentoRows.map((row) => ({
		...row.lancamento,
		pagador: row.pagador,
		conta: row.conta,
		cartao: row.cartao,
		categoria: row.categoria,
	}));
}
