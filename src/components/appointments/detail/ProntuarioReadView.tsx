"use client";

import { Separator } from "@/components/ui/separator";
import type { ProntuarioReadViewProps } from "./ProntuarioReadView.types";

export function ProntuarioReadView({ prontuario }: ProntuarioReadViewProps) {
	const fields: [string, string | undefined][] = [
		["Anotações clínicas / Exame físico", prontuario.clinicalNotes],
		["Diagnóstico", prontuario.diagnosis],
		["CID-10", prontuario.diagnosisCid],
		["Prescrição", prontuario.prescription],
		["Solicitações de exame", prontuario.examRequests],
		["Plano terapêutico", prontuario.treatmentPlan],
		["Orientações e retorno", prontuario.followUpInstructions],
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
