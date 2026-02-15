"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePreferencesAction } from "@/app/(dashboard)/ajustes/actions";
import { useFont } from "@/components/font-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FONT_OPTIONS, getFontVariable } from "@/public/fonts/font_index";

interface PreferencesFormProps {
	disableMagnetlines: boolean;
	systemFont: string;
	moneyFont: string;
}

export function PreferencesForm({
	disableMagnetlines,
	systemFont: initialSystemFont,
	moneyFont: initialMoneyFont,
}: PreferencesFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [magnetlinesDisabled, setMagnetlinesDisabled] =
		useState(disableMagnetlines);
	const [selectedSystemFont, setSelectedSystemFont] =
		useState(initialSystemFont);
	const [selectedMoneyFont, setSelectedMoneyFont] = useState(initialMoneyFont);

	const fontCtx = useFont();

	// Live preview: update CSS vars when font selection changes
	useEffect(() => {
		fontCtx.setSystemFont(selectedSystemFont);
	}, [selectedSystemFont, fontCtx.setSystemFont]);

	useEffect(() => {
		fontCtx.setMoneyFont(selectedMoneyFont);
	}, [selectedMoneyFont, fontCtx.setMoneyFont]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(async () => {
			const result = await updatePreferencesAction({
				disableMagnetlines: magnetlinesDisabled,
				systemFont: selectedSystemFont,
				moneyFont: selectedMoneyFont,
			});

			if (result.success) {
				toast.success(result.message);
				router.refresh();
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-8">
			{/* Seção 1: Tipografia */}
			<section className="space-y-5">
				<div>
					<h3 className="text-base font-semibold">Tipografia</h3>
					<p className="text-sm text-muted-foreground">
						Personalize as fontes usadas na interface e nos valores monetários.
					</p>
				</div>

				{/* Fonte do sistema */}
				<div className="space-y-2 max-w-md">
					<Label htmlFor="system-font">Fonte do sistema</Label>
					<Select
						value={selectedSystemFont}
						onValueChange={setSelectedSystemFont}
					>
						<SelectTrigger id="system-font">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FONT_OPTIONS.map((opt) => (
								<SelectItem key={opt.key} value={opt.key}>
									<span
										style={{
											fontFamily: opt.variable,
										}}
									>
										{opt.label}
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p
						className="text-sm text-muted-foreground pt-1"
						style={{
							fontFamily: getFontVariable(selectedSystemFont),
						}}
					>
						Suas finanças em um só lugar
					</p>
				</div>

				{/* Fonte de valores */}
				<div className="space-y-2 max-w-md">
					<Label htmlFor="money-font">Fonte de valores</Label>
					<Select
						value={selectedMoneyFont}
						onValueChange={setSelectedMoneyFont}
					>
						<SelectTrigger id="money-font">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FONT_OPTIONS.map((opt) => (
								<SelectItem key={opt.key} value={opt.key}>
									<span
										style={{
											fontFamily: opt.variable,
										}}
									>
										{opt.label}
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p
						className="text-sm text-muted-foreground pt-1 tabular-nums"
						style={{
							fontFamily: getFontVariable(selectedMoneyFont),
						}}
					>
						R$ 1.234,56
					</p>
				</div>
			</section>

			<div className="border-b" />

			{/* Seção 3: Dashboard */}
			<section className="space-y-4">
				<div>
					<h3 className="text-base font-semibold">Dashboard</h3>
					<p className="text-sm text-muted-foreground">
						Opções que afetam a experiência no painel principal.
					</p>
				</div>

				<div className="flex items-center justify-between rounded-lg border p-4 max-w-md">
					<div className="space-y-0.5">
						<Label htmlFor="magnetlines" className="text-base">
							Desabilitar Magnetlines
						</Label>
						<p className="text-sm text-muted-foreground">
							Remove o recurso de linhas magnéticas do sistema.
						</p>
					</div>
					<Switch
						id="magnetlines"
						checked={magnetlinesDisabled}
						onCheckedChange={setMagnetlinesDisabled}
						disabled={isPending}
					/>
				</div>
			</section>

			<div className="flex justify-end">
				<Button type="submit" disabled={isPending} className="w-fit">
					{isPending ? "Salvando..." : "Salvar preferências"}
				</Button>
			</div>
		</form>
	);
}
