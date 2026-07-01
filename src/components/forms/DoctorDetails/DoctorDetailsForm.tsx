"use client";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { useDoctorDetailsForm } from "@/hooks/use-doctor-details-form";
import type { DoctorDetailsProps } from "./DoctorDetailsForm.types";
import { DoctorPersonalFields } from "./DoctorPersonalFields";

function DoctorDetailsForm(props: DoctorDetailsProps) {
	const {
		form,
		selectedProfession,
		professionOptions,
		specialtyOptions,
		onSubmit,
		type,
	} = useDoctorDetailsForm(props);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex-1 space-y-12"
			>
				<DoctorPersonalFields form={form} />

				<h2 className="sub-header">Informações Profissionais</h2>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						form={form}
						name="profession"
						fieldType={FormFieldType.SELECT}
						label="Profissão"
						placeholder="Selecione a profissão"
						selectOptions={professionOptions}
					/>

					<CustomFormField
						form={form}
						name="specialty"
						fieldType={FormFieldType.SELECT}
						label="Especialidade"
						placeholder={
							selectedProfession
								? "Selecione a especialidade"
								: "Primeiro selecione a profissão"
						}
						selectOptions={specialtyOptions}
						disabled={!selectedProfession}
					/>
				</div>

				<CustomFormField
					form={form}
					name="licenseNumber"
					fieldType={FormFieldType.INPUT}
				/>

				<CustomSubmitButton form={form}>
					{type === "create" ? "Enviar e Continuar" : "Salvar"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
}

export default DoctorDetailsForm;
