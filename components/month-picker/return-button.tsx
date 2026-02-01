"use client";

import React from "react";
import { Button } from "../ui/button";

interface ReturnButtonProps {
	disabled?: boolean;
	onClick: () => void;
}

const ReturnButton = React.memo(({ disabled, onClick }: ReturnButtonProps) => {
	return (
		<Button
			className="w-32 h-6 rounded-sm lowercase"
			size="sm"
			disabled={disabled}
			onClick={onClick}
			aria-label="Retornar para o mês atual"
		>
			Ir para Mês Atual
		</Button>
	);
});

ReturnButton.displayName = "ReturnButton";

export default ReturnButton;
