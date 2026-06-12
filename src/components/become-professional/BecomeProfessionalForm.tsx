"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateProfessional } from "@/hooks/api/doctors/use-create-professional";
import {
	PROFESSION_SPECIALTIES,
	SPECIALTY_LABELS,
} from "@/utils/constants/profession-specialties";
import { PROFESSIONAL_TYPE_OPTIONS } from "@/utils/constants/professional-types";

const becomeProfessionalSchema = z.object({
	profession: z.string().min(1, "Selecione uma profissão"),
	specialty: z.string().min(1, "Selecione uma especialidade"),
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50, "Número de registro muito longo"),
});

type BecomeProfessionalValues = z.infer<typeof becomeProfessionalSchema>;

export function BecomeProfessionalForm() {
	const { mutateAsync: createProfessional, isPending } =
		useCreateProfessional();

	const form = useForm<BecomeProfessionalValues>({
		resolver: zodResolver(becomeProfessionalSchema),
		defaultValues: { profession: "", specialty: "", licenseNumber: "" },
	});

	const selectedProfession = useWatch({
		control: form.control,
		name: "profession",
	});
	const availableSpecialties = selectedProfession
		? (PROFESSION_SPECIALTIES[selectedProfession] ?? [])
		: [];

	useEffect(() => {
		if (selectedProfession) {
			form.setValue("specialty", "", { shouldValidate: false });
		}
	}, [selectedProfession, form]);

	async function onSubmit(values: BecomeProfessionalValues) {
		try {
			await createProfessional(values);
			toast.success("Solicitação enviada com sucesso!", {
				description: "Sua candidatura está em análise. Aguarde a aprovação.",
			});
		} catch {
			toast.error("Erro ao enviar solicitação", {
				description: "Verifique os dados e tente novamente.",
			});
		}
	}

	const licenseHint =
		selectedProfession === "MEDICO"
			? "Ex: CRM/SP 123456"
			: selectedProfession === "NUTRICIONISTA"
				? "Ex: CRN/SP 1234"
				: selectedProfession === "FISIOTERAPEUTA"
					? "Ex: CREFITO/SP 12345"
					: selectedProfession === "PSICOLOGO"
						? "Ex: CRP/SP 123456"
						: selectedProfession === "DENTISTA"
							? "Ex: CRO/SP 123456"
							: "Ex: CRM/CRN/CRP/CREFITO 123456";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<BadgeCheck className="h-4 w-4 text-primary" />
					Dados profissionais
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
							selectOptions={availableSpecialties.map((s) => ({
								value: s,
								label: SPECIALTY_LABELS[s] ?? s,
							}))}
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
			</CardContent>
		</Card>
	);
}
