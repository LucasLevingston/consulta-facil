"use client";

import type { FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { PROFESSIONAL_TYPE_OPTIONS } from "@/utils/constants/professional-types";
import type { BecomeProfessionalValues } from "./BecomeProfessionalForm.schema";

interface Props {
	form: UseFormReturn<BecomeProfessionalValues>;
	isPending: boolean;
	availableSpecialties: { value: string; label: string }[];
	selectedProfession: string | undefined;
	licenseHint: string;
	onSubmit: FormEventHandler<HTMLFormElement>;
}

export function BecomeProfessionalFormContent({
	form,
	isPending,
	availableSpecialties,
	selectedProfession,
	licenseHint,
	onSubmit,
}: Props) {
	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<CustomFormField
					form={form}
					name="profession"
					fieldType={FormFieldType.SELECT}
					label="Profissão"
					placeholder="Selecione sua profissão"
					selectOptions={PROFESSIONAL_TYPE_OPTIONS}
				/>
				<CustomFormField
					form={form}
					name="specialty"
					fieldType={FormFieldType.SELECT}
					label="Especialidade"
					placeholder={
						selectedProfession
							? "Selecione sua especialidade"
							: "Primeiro selecione a profissão"
					}
					selectOptions={availableSpecialties}
					disabled={!selectedProfession}
				/>
				<CustomFormField
					form={form}
					name="licenseNumber"
					fieldType={FormFieldType.INPUT}
					label="Número de registro"
					placeholder={licenseHint}
				/>
				<CustomSubmitButton form={form} isSubmitting={isPending}>
					Enviar solicitação
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
