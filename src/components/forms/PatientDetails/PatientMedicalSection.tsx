import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import type { PatientMedicalSectionProps } from "./PatientMedicalSection.types";

export function PatientMedicalSection({ form }: PatientMedicalSectionProps) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Informações Médicas</h2>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="allergies"
					label="Alergias (se houver)"
					placeholder="Amendoins, Penicilina, Polen"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="currentMedication"
					label="Medicações Atuais"
					placeholder="Ibuprofeno 200mg, Levotiroxina 50mcg"
				/>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="familyMedicalHistory"
					label="Histórico Médico Familiar (se relevante)"
					placeholder="Mãe teve câncer cerebral, Pai tem hipertensão"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="pastMedicalHistory"
					label="Histórico Médico Anterior"
					placeholder="Apendicectomia em 2015, Diagnóstico de asma na infância"
				/>
			</div>
		</section>
	);
}
