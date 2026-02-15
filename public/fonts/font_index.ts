import {
Fira_Code,
	Fira_Sans,
	Geist,
	IBM_Plex_Mono,
	Inter,
	JetBrains_Mono,
	Reddit_Sans,
	Roboto,
	Ubuntu,
} from "next/font/google";
import localFont from "next/font/local";

const ai_sans = localFont({
	src: [
		{
			path: "./AISans-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./AISans-Semibold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-ai-sans",
});

const anthropic_sans = localFont({
	src: "./anthropicSans.woff2",
	display: "swap",
	variable: "--font-anthropic-sans",
});

const sf_pro_display = localFont({
	src: [
		{
			path: "./SF-Pro-Display-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./SF-Pro-Display-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./SF-Pro-Display-Semibold.otf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./SF-Pro-Display-Bold.otf",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-sf-pro-display",
});

const sf_pro_rounded = localFont({
	src: [
		{
			path: "./SF-Pro-Rounded-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./SF-Pro-Rounded-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./SF-Pro-Rounded-Semibold.otf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./SF-Pro-Rounded-Bold.otf",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-sf-pro-rounded",
});

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const geist_sans = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist",
});

const roboto = Roboto({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto",
});

const reddit_sans = Reddit_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-reddit-sans",
});

const fira_sans = Fira_Sans({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-fira-sans",
});

const ubuntu = Ubuntu({
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ubuntu",
});

const jetbrains_mono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains-mono",
});

const fira_code = Fira_Code({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-fira-code",
});

const ibm_plex_mono = IBM_Plex_Mono({
	weight: ["400", "500", "600"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ibm-plex-mono",
});

export type FontOption = {
	key: string;
	label: string;
	variable: string;
};

export const FONT_OPTIONS: FontOption[] = [
	{ key: "ai-sans", label: "AI Sans", variable: "var(--font-ai-sans)" },
	{
		key: "anthropic-sans",
		label: "Anthropic Sans",
		variable: "var(--font-anthropic-sans)",
	},
{ key: "fira-code", label: "Fira Code", variable: "var(--font-fira-code)" },
	{
		key: "fira-sans",
		label: "Fira Sans",
		variable: "var(--font-fira-sans)",
	},
	{ key: "geist", label: "Geist Sans", variable: "var(--font-geist)" },
	{
		key: "ibm-plex-mono",
		label: "IBM Plex Mono",
		variable: "var(--font-ibm-plex-mono)",
	},
	{ key: "inter", label: "Inter", variable: "var(--font-inter)" },
	{
		key: "jetbrains-mono",
		label: "JetBrains Mono",
		variable: "var(--font-jetbrains-mono)",
	},
	{
		key: "reddit-sans",
		label: "Reddit Sans",
		variable: "var(--font-reddit-sans)",
	},
	{ key: "roboto", label: "Roboto", variable: "var(--font-roboto)" },
	{
		key: "sf-pro-display",
		label: "SF Pro Display",
		variable: "var(--font-sf-pro-display)",
	},
	{
		key: "sf-pro-rounded",
		label: "SF Pro Rounded",
		variable: "var(--font-sf-pro-rounded)",
	},
	{ key: "ubuntu", label: "Ubuntu", variable: "var(--font-ubuntu)" },
];

/** @deprecated Use FONT_OPTIONS */
export const SYSTEM_FONT_OPTIONS = FONT_OPTIONS;
/** @deprecated Use FONT_OPTIONS */
export const MONEY_FONT_OPTIONS = FONT_OPTIONS;

const allFonts = [
	ai_sans,
	anthropic_sans,
	sf_pro_display,
	sf_pro_rounded,
	inter,
	geist_sans,
	roboto,
	reddit_sans,
	fira_sans,
	ubuntu,
jetbrains_mono,
	fira_code,
	ibm_plex_mono,
];

export const allFontVariables = allFonts.map((f) => f.variable).join(" ");

// Backward compatibility
export const main_font = ai_sans;
export const money_font = ai_sans;

export function getFontVariable(key: string): string {
	const option = FONT_OPTIONS.find((o) => o.key === key);
	return option?.variable ?? "var(--font-ai-sans)";
}
