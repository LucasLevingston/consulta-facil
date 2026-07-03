"use client";

import { MedicalRecordField } from "@/components/appointments/detail/MedicalRecordField";
import { CustomButton } from "@/components/custom/custom-button";
import type { ProntuarioInput } from "@/features/appointments";

interface Props {
	form: ProntuarioInput;
	isPending: boolean;
	onSave: () => void;
	onCancel: () => void;
	onChange: (field: keyof ProntuarioInput, value: string) => void;
}

export function ProntuarioEditForm({
	form,
	isPending,
	onSave,
	onCancel,
	onChange,
}: Props) {
	return (
		<div className="space-y-4">
			<MedicalRecordField
				label="Anotações clínicas / Exame físico"
				value={form.clinicalNotes ?? ""}
				onChange={(v) => onChange("clinicalNotes", v)}
			/>
			<MedicalRecordField
				label="Diagnóstico"
				value={form.diagnosis ?? ""}
				onChange={(v) => onChange("diagnosis", v)}
			/>
			<MedicalRecordField
				label="CID-10"
				value={form.diagnosisCid ?? ""}
				onChange={(v) => onChange("diagnosisCid", v)}
			/>
			<MedicalRecordField
				label="Prescrição"
				value={form.prescription ?? ""}
				onChange={(v) => onChange("prescription", v)}
			/>
			<MedicalRecordField
				label="Solicitações de exame"
				value={form.examRequests ?? ""}
				onChange={(v) => onChange("examRequests", v)}
			/>
			<MedicalRecordField
				label="Plano terapêutico"
				value={form.treatmentPlan ?? ""}
				onChange={(v) => onChange("treatmentPlan", v)}
			/>
			<MedicalRecordField
				label="Orientações e retorno"
				value={form.followUpInstructions ?? ""}
				onChange={(v) => onChange("followUpInstructions", v)}
			/>
			<div className="flex gap-2 pt-1">
				<CustomButton size="sm" onClick={onSave} disabled={isPending}>
					{isPending ? "Salvando..." : "Salvar"}
				</CustomButton>
				<CustomButton variant="ghost" size="sm" onClick={onCancel}>
					Cancelar
				</CustomButton>
			</div>
		</div>
	);
}
