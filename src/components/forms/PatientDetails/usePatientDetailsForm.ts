"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { PatientFormValidation } from "./FormValidation";
import type { PatientDetailsProps } from "./PatientDetailsForm.types";
import { useUpdateMyProfile } from "./use-update-my-profile";

export function usePatientDetailsForm({
	userEmail,
	type,
	defaultData,
}: Omit<PatientDetailsProps, "userId">) {
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

	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
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
			if (type === "create") router.push("/");
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao salvar os dados",
			);
		}
	}

	return { form, onSubmit };
}
