import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import type { PatientFormValidation } from "./FormValidation";

type FormValues = z.infer<typeof PatientFormValidation>;

export function PatientConsentSection({
	form,
}: {
	form: UseFormReturn<FormValues>;
}) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Consentimento e Privacidade</h2>
			</div>

			<CustomFormField
				form={form}
				fieldType={FormFieldType.CHECKBOX}
				name="treatmentConsent"
				label="Eu consinto em receber tratamento para minha condição de saúde."
			/>
			<CustomFormField
				form={form}
				fieldType={FormFieldType.CHECKBOX}
				name="disclosureConsent"
				label="Eu consinto com o uso e divulgação das minhas informações de saúde para fins de tratamento."
			/>
			<CustomFormField
				form={form}
				fieldType={FormFieldType.CHECKBOX}
				name="privacyConsent"
				label="Eu reconheço que revisei e concordo com a política de privacidade."
			/>
		</section>
	);
}
