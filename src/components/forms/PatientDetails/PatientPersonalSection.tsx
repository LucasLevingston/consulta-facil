import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import type { PatientPersonalSectionProps } from "./PatientPersonalSection.types";
import { PatientPersonalTopColumns } from "./PatientPersonalTopColumns";

export function PatientPersonalSection({ form }: PatientPersonalSectionProps) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Informações Pessoais</h2>
			</div>
			<PatientPersonalTopColumns form={form} />
			<CustomFormField
				form={form}
				fieldType={FormFieldType.INPUT}
				name="cpf"
				label="CPF"
				placeholder="12345678900"
			/>
			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="address"
					label="Endereço"
					placeholder="14 rua, Nova Iorque, NY - 5101"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="occupation"
					label="Ocupação"
					placeholder="Engenheiro de Software"
				/>
			</div>
			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="emergencyContactName"
					label="Nome do Contato de Emergência"
					placeholder="Nome do responsável"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="emergencyContactNumber"
					label="Número do Contato de Emergência"
					placeholder="(11) 91234-5678"
					type="tel"
				/>
			</div>
		</section>
	);
}
