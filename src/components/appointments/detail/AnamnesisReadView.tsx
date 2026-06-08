"use client";

import { Separator } from "@/components/ui/separator";
import type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";

export function AnamnesisReadView({
	anamnesis,
}: {
	anamnesis: AnamnesisResponse;
}) {
	const fields: [string, string | undefined][] = [
		["Queixa principal", anamnesis.chiefComplaint],
		["Medicamentos em uso", anamnesis.currentMedications],
		["Alergias", anamnesis.allergies],
		["Histórico médico", anamnesis.medicalHistory],
		["Histórico familiar", anamnesis.familyHistory],
		["Observações", anamnesis.observations],
	];

	const filled = fields.filter(([, v]) => v);
	if (filled.length === 0)
		return (
			<p className="text-sm text-muted-foreground">
				Sem informações preenchidas.
			</p>
		);

	return (
		<div className="space-y-3">
			{filled.map(([label, value], i) => (
				<div key={label}>
					{i > 0 && <Separator className="mb-3" />}
					<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
					<p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
				</div>
			))}
		</div>
	);
}
