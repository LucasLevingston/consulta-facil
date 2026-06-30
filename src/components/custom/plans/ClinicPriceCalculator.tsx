"use client";

import { CheckCircle2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import type { ClinicPriceCalculatorProps } from "./ClinicPriceCalculator.types";

function calcMonthlyPrice(totalProfessionals: number): number {
	const extra = Math.max(0, totalProfessionals - FREE_PROFESSIONALS);
	return BASE_PRICE * (1 + extra * 0.2);
}

function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
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

				<div className="flex items-end justify-between gap-4">
					<div>
						{isFree ? (
							<>
								<p className="text-3xl font-bold text-emerald-600">Grátis</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									{calcProfessionals * FREE_CONSULTS_PER_DOCTOR} consultas
									gratuitas incluídas
								</p>
							</>
						) : (
							<>
								<p className="text-3xl font-bold text-foreground">
									R$ {fmtBRL(calcPrice)}
									<span className="text-base font-normal text-muted-foreground">
										/mês
									</span>
								</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									Base R$ {fmtBRL(BASE_PRICE)} + {extraProfessionals}{" "}
									profissional
									{extraProfessionals !== 1 ? "is" : ""} extra (
									{extraProfessionals * 20}% adicional)
								</p>
							</>
						)}
					</div>
					<div className="shrink-0 text-right">
						{isFree ? (
							<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
								<CheckCircle2 className="mr-1 h-3 w-3" />
								Plano grátis
							</Badge>
						) : (
							<Badge variant="secondary">
								{extraProfessionals} além do limite
							</Badge>
						)}
					</div>
				</div>

				{calcProfessionals > FREE_PROFESSIONALS && (
					<div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
						<p className="font-medium text-foreground">Composição do preço:</p>
						<p>
							Base ({FREE_PROFESSIONALS} profissionais): R$ {fmtBRL(BASE_PRICE)}
						</p>
						{Array.from({ length: extraProfessionals }, (_, i) => {
							const doctorNumber = FREE_PROFESSIONALS + i + 1;
							return (
								<p key={doctorNumber}>
									{doctorNumber}º profissional (+20%): R${" "}
									{fmtBRL(BASE_PRICE * 0.2)}
								</p>
							);
						})}
						<Separator className="my-1" />
						<p className="font-semibold text-foreground">
							Total: R$ {fmtBRL(calcPrice)}/mês
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
