"use client";

import { MedicalRecordField } from "@/components/appointments/detail/MedicalRecordField";
import { CustomButton } from "@/components/custom/custom-button";
import type { AnamnesisInput } from "@/features/appointments";

interface Props {
	form: AnamnesisInput;
	isPending: boolean;
	onSave: () => void;
	onCancel: () => void;
	onChange: (field: keyof AnamnesisInput, value: string) => void;
}

export function AnamnesisEditForm({
	form,
	isPending,
	onSave,
	onCancel,
	onChange,
}: Props) {
	return (
		<div className="space-y-4">
			<MedicalRecordField
				label="Queixa principal"
				value={form.chiefComplaint ?? ""}
				onChange={(v) => onChange("chiefComplaint", v)}
			/>
			<MedicalRecordField
				label="Medicamentos em uso"
				value={form.currentMedications ?? ""}
				onChange={(v) => onChange("currentMedications", v)}
			/>
			<MedicalRecordField
				label="Alergias"
				value={form.allergies ?? ""}
				onChange={(v) => onChange("allergies", v)}
			/>
			<MedicalRecordField
				label="Histórico médico"
				value={form.medicalHistory ?? ""}
				onChange={(v) => onChange("medicalHistory", v)}
			/>
			<MedicalRecordField
				label="Histórico familiar"
				value={form.familyHistory ?? ""}
				onChange={(v) => onChange("familyHistory", v)}
			/>
			<MedicalRecordField
				label="Observações"
				value={form.observations ?? ""}
				onChange={(v) => onChange("observations", v)}
			/>
			<div className="flex gap-2 pt-1">
				<CustomButton size="sm" onClick={onSave} disabled={isPending}>
					{isPending ? "Salvando..." : "Salvar"}
				</CustomButton>
				<CustomButton variant="secondary" size="sm" onClick={onCancel}>
					Cancelar
				</CustomButton>
			</div>
		</div>
	);
}
