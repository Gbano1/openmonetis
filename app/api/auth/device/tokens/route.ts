import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { tokensApi } from "@/db/schema";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";

export async function GET() {
	try {
		// Verificar autenticação via sessão web
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session?.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		// Buscar tokens ativos do usuário
		const tokens = await db
			.select({
				id: tokensApi.id,
				name: tokensApi.name,
				tokenPrefix: tokensApi.tokenPrefix,
				lastUsedAt: tokensApi.lastUsedAt,
				lastUsedIp: tokensApi.lastUsedIp,
				expiresAt: tokensApi.expiresAt,
				createdAt: tokensApi.createdAt,
			})
			.from(tokensApi)
			.where(eq(tokensApi.userId, session.user.id))
			.orderBy(desc(tokensApi.createdAt));

		// Separar tokens ativos e revogados
		const activeTokens = tokens.filter(
			(t) => !t.expiresAt || new Date(t.expiresAt) > new Date(),
		);

		return NextResponse.json({ tokens: activeTokens });
	} catch (error) {
		console.error("[API] Error listing device tokens:", error);
		return NextResponse.json(
			{ error: "Erro ao listar tokens" },
			{ status: 500 },
		);
	}
}
