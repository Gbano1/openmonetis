"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { RiBankCard2Line, RiCalendarLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryPeriodMode } from "@/lib/dashboard/categories/category-details";
import { cn } from "@/lib/utils/ui";

const MODES: { value: CategoryPeriodMode; label: string; icon: typeof RiCalendarLine }[] = [
	{ value: "mes", label: "Baseado no mês", icon: RiCalendarLine },
	{ value: "fatura-cartao", label: "Baseado na fatura do cartão", icon: RiBankCard2Line },
];

type CategoryPeriodModeFilterProps = {
	currentMode: CategoryPeriodMode;
	className?: string;
};

export function CategoryPeriodModeFilter({
	currentMode,
	className,
}: CategoryPeriodModeFilterProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const buildHref = (filtro: CategoryPeriodMode) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("filtro", filtro);
		return `${pathname}?${params.toString()}`;
	};

	const current = MODES.find((m) => m.value === currentMode) ?? MODES[0];
	const CurrentIcon = current.icon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn("gap-2", className)}
					aria-label="Filtro de período"
				>
					<CurrentIcon className="size-4 shrink-0" />
					<span className="truncate">{current.label}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[220px]">
				{MODES.map(({ value, label, icon: Icon }) => (
					<DropdownMenuItem key={value} asChild>
						<Link
							href={buildHref(value)}
							className={cn(
								"flex items-center gap-2",
								value === currentMode && "bg-accent",
							)}
						>
							<Icon className="size-4 shrink-0" />
							{label}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
