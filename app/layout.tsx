import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { allFontVariables } from "@/public/fonts/font_index";
import "./globals.css";

export const metadata: Metadata = {
	title: "Opensheets",
	description: "Finanças pessoais descomplicadas.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={allFontVariables} suppressHydrationWarning>
			<head>
				<meta name="apple-mobile-web-app-title" content="Opensheets" />
			</head>
			<body className="antialiased" suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="light">
					{children}
					<Toaster position="top-right" />
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
