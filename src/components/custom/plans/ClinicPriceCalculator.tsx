"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import { ClinicPriceBreakdown } from "./ClinicPriceBreakdown";
import type { ClinicPriceCalculatorProps } from "./ClinicPriceCalculator.types";
import { ClinicPriceDisplay } from "./ClinicPriceDisplay";

function calcMonthlyPrice(totalProfessionals: number): number {
	const extra = Math.max(0, totalProfessionals - FREE_PROFESSIONALS);
	return BASE_PRICE * (1 + extra * 0.2);
}

export function ClinicPriceCalculator({
	initialProfessionals,
}: ClinicPriceCalculatorProps) {
	const [calcProfessionals, setCalcProfessionals] = useState(
		Math.max(initialProfessionals, 1),
	);

	const calcPrice = calcMonthlyPrice(calcProfessionals);
	const extraProfessionals = Math.max(
		0,
		calcProfessionals - FREE_PROFESSIONALS,
	);
	const isFree = calcProfessionals <= FREE_PROFESSIONALS;

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Calculadora de preço</CardTitle>
				<CardDescription>
					Simule o custo mensal conforme o número de profissionais na clínica
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="flex items-center justify-between gap-4">
					<span className="text-sm text-muted-foreground">
						Quantidade de profissionais
					</span>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 rounded-lg"
							onClick={() => setCalcProfessionals((n) => Math.max(1, n - 1))}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<span className="w-8 text-center text-lg font-semibold tabular-nums">
							{calcProfessionals}
						</span>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 rounded-lg"
							onClick={() => setCalcProfessionals((n) => Math.min(50, n + 1))}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>
				</div>
				<Separator />
				<ClinicPriceDisplay
					isFree={isFree}
					calcPrice={calcPrice}
					extraProfessionals={extraProfessionals}
					calcProfessionals={calcProfessionals}
				/>
				{!isFree && (
					<ClinicPriceBreakdown
						extraProfessionals={extraProfessionals}
						calcPrice={calcPrice}
					/>
				)}
			</CardContent>
		</Card>
	);
}
