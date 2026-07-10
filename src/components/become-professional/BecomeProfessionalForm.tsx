"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useCreateProfessional } from "@/components/professionals/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PROFESSION_SPECIALTIES,
	SPECIALTY_LABELS,
} from "@/utils/constants/profession-specialties";
import {
	type BecomeProfessionalValues,
	becomeProfessionalSchema,
} from "./BecomeProfessionalForm.schema";
import { BecomeProfessionalFormContent } from "./BecomeProfessionalFormContent";

export function BecomeProfessionalForm() {
	const { mutateAsync: createProfessional, isPending } =
		useCreateProfessional();

	const form = useForm<BecomeProfessionalValues>({
		resolver: zodResolver(becomeProfessionalSchema),
		defaultValues: { licenseNumber: "" },
	});

	const selectedProfession = useWatch({
		control: form.control,
		name: "profession",
	});
	const availableSpecialties = selectedProfession
		? (PROFESSION_SPECIALTIES[selectedProfession] ?? [])
		: [];

	useEffect(() => {
		if (selectedProfession) form.resetField("specialty");
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
				<BecomeProfessionalFormContent
					form={form}
					isPending={isPending}
					availableSpecialties={availableSpecialties.map((s) => ({
						value: s,
						label: SPECIALTY_LABELS[s] ?? s,
					}))}
					selectedProfession={selectedProfession}
					licenseHint={licenseHint}
					onSubmit={form.handleSubmit(onSubmit)}
				/>
			</CardContent>
		</Card>
	);
}
