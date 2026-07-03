"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { ProfessionalFormValidation } from "@/components/forms/DoctorDetails/FormValidation";
import type { ProfessionalDetailsProps } from "@/components/forms/DoctorDetails/ProfessionalDetailsForm.types";
import { useCreateProfessional, useUpdateProfessional } from "@/features/professionals";
import { PROFESSION_SPECIALTIES, professions } from "@/utils/constants/profession-specialties";

export function useProfessionalDetailsForm({
	userId,
	userEmail,
	type,
	defaultData,
}: ProfessionalDetailsProps) {
	const router = useRouter();
	const createProfessional = useCreateProfessional();
	const updateProfessional = useUpdateProfessional();

	const form = useForm<z.infer<typeof ProfessionalFormValidation>>({
		resolver: zodResolver(ProfessionalFormValidation),
		defaultValues: {
			name: defaultData?.name ?? "",
			email: defaultData?.email ?? userEmail,
			phone: defaultData?.phone ?? "",
			gender: "MALE",
			birthDate: new Date(),
			cpf: "",
			address: "",
			profession: defaultData?.profession ?? "",
			specialty: defaultData?.specialty ?? "",
			licenseNumber: defaultData?.licenseNumber ?? "",
			identificationDocumentType: "",
			identificationDocument: undefined,
			privacyConsent: false,
		},
	});

	const selectedProfession = useWatch({
		control: form.control,
		name: "profession",
	});
	const professionOptions = professions.map((p) => ({ value: p, label: p }));
	const specialtyOptions = (PROFESSION_SPECIALTIES[selectedProfession] ?? []).map((s) => ({
		value: s,
		label: s,
	}));

	const onSubmit = async (values: z.infer<typeof ProfessionalFormValidation>) => {
		const payload = {
			name: values.name,
			email: values.email,
			profession: values.profession,
			specialty: values.specialty,
			licenseNumber: values.licenseNumber,
			phone: values.phone,
		};

		try {
			if (type === "create") {
				await createProfessional.mutateAsync(payload);
				toast.success("Dados salvos com sucesso!");
				router.push("/");
			} else {
				await updateProfessional.mutateAsync({
					professionalId: userId,
					data: payload,
				});
				toast.success("Dados salvos com sucesso!");
			}
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "Erro ao salvar os dados");
		}
	};

	return {
		form,
		selectedProfession,
		professionOptions,
		specialtyOptions,
		onSubmit,
		isPending: createProfessional.isPending || updateProfessional.isPending,
		type,
	};
}
