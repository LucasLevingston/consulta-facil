"use client";

import { Separator } from "@/components/ui/separator";
import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

interface Props {
	extraProfessionals: number;
	calcPrice: number;
}

export function ClinicPriceBreakdown({ extraProfessionals, calcPrice }: Props) {
	return (
		<div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
			<p className="font-medium text-foreground">Composição do preço:</p>
			<p>
				Base ({FREE_PROFESSIONALS} profissionais): R$ {fmtBRL(BASE_PRICE)}
			</p>
			{Array.from({ length: extraProfessionals }, (_, i) => {
				const doctorNumber = FREE_PROFESSIONALS + i + 1;
				return (
					<p key={doctorNumber}>
						{doctorNumber}º profissional (+20%): R$ {fmtBRL(BASE_PRICE * 0.2)}
					</p>
				);
			})}
			<Separator className="my-1" />
			<p className="font-semibold text-foreground">
				Total: R$ {fmtBRL(calcPrice)}/mês
			</p>
		</div>
	);
}
