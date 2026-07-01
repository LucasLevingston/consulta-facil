"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { DoctorDetailsProps } from "@/components/forms/DoctorDetails/DoctorDetailsForm.types";
import { DoctorFormValidation } from "@/components/forms/DoctorDetails/FormValidation";
import { useCreateProfessional, useUpdateProfessional } from "@/features/professionals";
import { PROFESSION_SPECIALTIES, professions } from "@/utils/constants/profession-specialties";

export function useDoctorDetailsForm({ userId, userEmail, type, defaultData }: DoctorDetailsProps) {
	const router = useRouter();
	const createDoctor = useCreateProfessional();
	const updateDoctor = useUpdateProfessional();

	const form = useForm<z.infer<typeof DoctorFormValidation>>({
		resolver: zodResolver(DoctorFormValidation),
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

	const onSubmit = async (values: z.infer<typeof DoctorFormValidation>) => {
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
				await createDoctor.mutateAsync(payload);
				toast.success("Dados salvos com sucesso!");
				router.push("/");
			} else {
				await updateDoctor.mutateAsync({
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
		isPending: createDoctor.isPending || updateDoctor.isPending,
		type,
	};
}
