import { eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/lib/db";

export type FontPreferences = {
	systemFont: string;
	moneyFont: string;
};

const DEFAULT_FONT_PREFS: FontPreferences = {
	systemFont: "ai-sans",
	moneyFont: "ai-sans",
};

export const fetchUserFontPreferences = cache(
	async (userId: string): Promise<FontPreferences> => {
		const result = await db
			.select({
				systemFont: schema.preferenciasUsuario.systemFont,
				moneyFont: schema.preferenciasUsuario.moneyFont,
			})
			.from(schema.preferenciasUsuario)
			.where(eq(schema.preferenciasUsuario.userId, userId))
			.limit(1);

		if (!result[0]) return DEFAULT_FONT_PREFS;

		return {
			systemFont: result[0].systemFont,
			moneyFont: result[0].moneyFont,
		};
	},
);
