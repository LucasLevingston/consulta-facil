"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMedicalRecords } from "@/components/patients/hooks";
import {
	type MedicalRecord,
	type UpdateMedicalRecordInput,
	updateMedicalRecordSchema,
} from "@/features/patients";
import { getBmiLabel } from "@/features/patients/services/bmi.service";
import { toNumber } from "@/utils/to-number";
import { useUpdateMedicalRecords } from "./use-update-medical-records";

export { getBmiLabel, toNumber };

export function useMedicalHealthForm(userId: string) {
	const { data: record } = useMedicalRecords(userId);
	const { mutate, isPending } = useUpdateMedicalRecords(userId);

	const form = useForm<UpdateMedicalRecordInput>({
		resolver: zodResolver(updateMedicalRecordSchema),
		defaultValues: {
			bloodType: null,
			height: null,
			weight: null,
			allergies: "",
			currentMedication: "",
			familyMedicalHistory: "",
			pastMedicalHistory: "",
		},
	});

	useEffect(() => {
		if (record) {
			form.reset({
				bloodType: (record as MedicalRecord).bloodType ?? null,
				height: (record as MedicalRecord).height ?? null,
				weight: (record as MedicalRecord).weight ?? null,
				allergies: record.allergies ?? "",
				currentMedication: record.currentMedication ?? "",
				familyMedicalHistory: record.familyMedicalHistory ?? "",
				pastMedicalHistory: record.pastMedicalHistory ?? "",
			});
		}
	}, [record, form]);

	const height = form.watch("height");
	const weight = form.watch("weight");
	const bmi =
		height && weight && height > 0 ? weight / (height * height) : null;

	function onSubmit(data: UpdateMedicalRecordInput) {
		mutate(data, {
			onSuccess: () => toast.success("Dados de saúde atualizados!"),
			onError: () => toast.error("Erro ao salvar."),
		});
	}

	return { form, bmi, getBmiLabel, toNumber, isPending, onSubmit };
}
