"use client";

import { Calculator, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFeeConfig } from "@/hooks/api/billing/use-fee-config";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants/fee-payment-method-labels";
import type { FeePaymentMethod } from "@/lib/types/fee-payment-method";
import { calculateFees } from "@/lib/utils/calculate-fees";
import { formatBRL } from "@/utils/format-brl";

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
					<div className="overflow-x-auto rounded-xl border border-border">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/40">
									<th className="px-3 py-2 text-left font-medium text-muted-foreground">
										Método
									</th>
									<th className="px-3 py-2 text-right font-medium text-muted-foreground">
										Taxa MP
									</th>
									<th className="px-3 py-2 text-right font-medium text-muted-foreground">
										Plataforma
									</th>
									<th className="px-3 py-2 text-right font-medium text-muted-foreground">
										{profAbsorbs ? "Você recebe" : "Paciente paga"}
									</th>
								</tr>
							</thead>
							<tbody>
								{result.comparison.map((row) => {
									const isBest =
										row.paymentMethod === bestMethod?.paymentMethod;
									return (
										<tr
											key={row.paymentMethod}
											className={`border-b border-border/50 last:border-0 ${isBest ? "bg-green-500/5" : ""}`}
										>
											<td className="px-3 py-2.5 font-medium flex items-center gap-1.5">
												{isBest && (
													<Trophy className="h-3.5 w-3.5 text-green-500 shrink-0" />
												)}
												{PAYMENT_METHOD_LABELS[
													row.paymentMethod as FeePaymentMethod
												] ?? row.paymentMethod}
											</td>
											<td className="px-3 py-2.5 text-right text-muted-foreground">
												{formatBRL(row.mpFeeAmount)}
											</td>
											<td className="px-3 py-2.5 text-right text-muted-foreground">
												{formatBRL(row.platformFeeAmount)}
											</td>
											<td
												className={`px-3 py-2.5 text-right font-semibold ${isBest ? "text-green-600" : ""}`}
											>
												{formatBRL(
													profAbsorbs
														? row.professionalReceives
														: row.patientPays,
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
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
