"use client";

import "react-datepicker/dist/react-datepicker.css";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { PatientConsentSection } from "./PatientConsentSection";
import type { PatientDetailsProps } from "./PatientDetailsForm.types";
import { PatientIdentificationSection } from "./PatientIdentificationSection";
import { PatientMedicalSection } from "./PatientMedicalSection";
import { PatientPersonalSection } from "./PatientPersonalSection";
import { usePatientDetailsForm } from "./usePatientDetailsForm";

const PatientDetailsForm = ({
	userId: _userId,
	userEmail,
	type,
	defaultData,
}: PatientDetailsProps) => {
	const { form, onSubmit } = usePatientDetailsForm({
		userEmail,
		type,
		defaultData,
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex-1 space-y-12"
			>
				<PatientPersonalSection form={form} />
				<PatientMedicalSection form={form} />
				{type === "create" && (
					<>
						<PatientIdentificationSection form={form} />
						<PatientConsentSection form={form} />
					</>
				)}
				<CustomSubmitButton form={form}>
					{type === "create" ? "Enviar e Continuar" : "Salvar"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
};

export default PatientDetailsForm;
