"use client";

import { Trophy } from "lucide-react";
import {
	FEE_PAYMENT_METHOD_LABELS,
	type FeePaymentMethod,
} from "@/features/billing";
import { formatBRL } from "@/utils/format-brl";

type FeeRow = {
	paymentMethod: string;
	mpFeeAmount: number;
	platformFeeAmount: number;
	professionalReceives: number;
	patientPays: number;
};

interface Props {
	comparison: FeeRow[];
	bestPaymentMethod: string | undefined;
	profAbsorbs: boolean;
}

export function FeeComparisonTable({
	comparison,
	bestPaymentMethod,
	profAbsorbs,
}: Props) {
	return (
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
					{comparison.map((row) => {
						const isBest = row.paymentMethod === bestPaymentMethod;
						return (
							<tr
								key={row.paymentMethod}
								className={`border-b border-border/50 last:border-0 ${isBest ? "bg-green-500/5" : ""}`}
							>
								<td className="px-3 py-2.5 font-medium flex items-center gap-1.5">
									{isBest && (
										<Trophy className="h-3.5 w-3.5 text-green-500 shrink-0" />
									)}
									{FEE_PAYMENT_METHOD_LABELS[
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
										profAbsorbs ? row.professionalReceives : row.patientPays,
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
