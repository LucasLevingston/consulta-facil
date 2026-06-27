"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { useUpdateMyProfile } from "@/hooks/api/patients/use-update-my-profile";
import { PatientFormValidation } from "./FormValidation";
import { PatientConsentSection } from "./PatientConsentSection";
import type { PatientDetailsProps } from "./PatientDetailsForm.types";
import { PatientIdentificationSection } from "./PatientIdentificationSection";
import { PatientMedicalSection } from "./PatientMedicalSection";
import { PatientPersonalSection } from "./PatientPersonalSection";

import "react-datepicker/dist/react-datepicker.css";

const PatientDetailsForm = ({
	userId: _userId,
	userEmail,
	type,
	defaultData,
}: PatientDetailsProps) => {
	const router = useRouter();
	const updateProfile = useUpdateMyProfile();

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			name: defaultData?.name ?? "",
			email: defaultData?.email ?? userEmail,
			phone: defaultData?.phone ?? "",
			birthDate: defaultData?.birthDate ?? new Date(),
			gender: defaultData?.gender ?? "MALE",
			address: defaultData?.address ?? "",
			occupation: defaultData?.occupation ?? "",
			emergencyContactName: defaultData?.emergencyContactName ?? "",
			emergencyContactNumber: defaultData?.emergencyContactNumber ?? "",
			allergies: defaultData?.allergies ?? "",
			currentMedication: defaultData?.currentMedication ?? "",
			familyMedicalHistory: defaultData?.familyMedicalHistory ?? "",
			pastMedicalHistory: defaultData?.pastMedicalHistory ?? "",
			identificationDocumentType:
				defaultData?.identificationDocumentType ?? "Birth Certificate",
			cpf: defaultData?.cpf ?? "",
			identificationDocument: undefined,
			imageProfile: undefined,
			treatmentConsent: defaultData?.treatmentConsent ?? false,
			disclosureConsent: defaultData?.disclosureConsent ?? false,
			privacyConsent: defaultData?.privacyConsent ?? false,
		},
	});

	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		try {
			await updateProfile.mutateAsync({
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: values.birthDate.toISOString(),
				gender: values.gender,
				address: values.address,
				occupation: values.occupation,
				emergencyContactName: values.emergencyContactName,
				emergencyContactNumber: values.emergencyContactNumber,
				allergies: values.allergies,
				currentMedication: values.currentMedication,
				familyMedicalHistory: values.familyMedicalHistory,
				pastMedicalHistory: values.pastMedicalHistory,
				cpf: values.cpf,
				privacyConsent: values.privacyConsent,
				treatmentConsent: values.treatmentConsent,
				disclosureConsent: values.disclosureConsent,
			});
			toast.success("Dados salvos com sucesso!");
			if (type === "create") {
				router.push("/");
			}
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao salvar os dados",
			);
		}
	};

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
