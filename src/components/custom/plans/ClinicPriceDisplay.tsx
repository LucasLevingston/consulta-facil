"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_CONSULTS_PER_PROFESSIONAL } from "@/utils/constants/free-consults-per-professional";

function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

interface Props {
	isFree: boolean;
	calcPrice: number;
	extraProfessionals: number;
	calcProfessionals: number;
}

export function ClinicPriceDisplay({
	isFree,
	calcPrice,
	extraProfessionals,
	calcProfessionals,
}: Props) {
	return (
		<div className="flex items-end justify-between gap-4">
			<div>
				{isFree ? (
					<>
						<p className="text-3xl font-bold text-emerald-600">Grátis</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{calcProfessionals * FREE_CONSULTS_PER_PROFESSIONAL} consultas
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
							Base R$ {fmtBRL(BASE_PRICE)} + {extraProfessionals} profissional
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
					<Badge variant="secondary">{extraProfessionals} além do limite</Badge>
				)}
			</div>
		</div>
	);
}
