"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFeeConfig } from "@/features/billing";
import { calculateFees } from "@/lib/utils/calculate-fees";
import { FeeComparisonTable } from "./FeeComparisonTable";

export function FeeCalculator() {
	const { data: config } = useFeeConfig();
	const [amount, setAmount] = useState(250);
	const [profAbsorbs, setProfAbsorbs] = useState(true);

	const result = useMemo(() => {
		if (!config || amount <= 0) return null;
		return calculateFees(amount, "PIX", config, profAbsorbs);
	}, [amount, config, profAbsorbs]);

	if (!config) return null;

	const bestMethod = result?.comparison.reduce((best, cur) =>
		cur.professionalReceives > best.professionalReceives ? cur : best,
	);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<Calculator className="h-4 w-4" />
					Calculadora de Taxas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
					<div className="flex-1 space-y-1.5">
						<Label htmlFor="fee-amount" className="text-sm">
							Valor da consulta (R$)
						</Label>
						<Input
							id="fee-amount"
							type="number"
							min={1}
							step={0.01}
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							className="max-w-xs"
						/>
					</div>
					<div className="flex items-center gap-2 pb-1">
						<Label
							htmlFor="absorbs-toggle"
							className="text-sm text-muted-foreground"
						>
							{profAbsorbs
								? "Profissional absorve taxas"
								: "Paciente paga a mais"}
						</Label>
						<Switch
							id="absorbs-toggle"
							checked={profAbsorbs}
							onCheckedChange={setProfAbsorbs}
						/>
					</div>
				</div>
				{result && (
					<FeeComparisonTable
						comparison={result.comparison}
						bestPaymentMethod={bestMethod?.paymentMethod}
						profAbsorbs={profAbsorbs}
					/>
				)}
				<p className="text-xs text-muted-foreground">
					Plano <span className="font-medium">{config.planName}</span> · Taxa
					plataforma:{" "}
					<span className="font-medium">
						{(config.platformFeeRate * 100).toFixed(2)}%
					</span>
				</p>
			</CardContent>
		</Card>
	);
}
