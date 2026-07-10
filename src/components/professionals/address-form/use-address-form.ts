"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProfessionalResponse } from "@/features/professionals";
import {
	type UpdateAddressInput,
	updateAddressSchema,
} from "@/features/professionals";
import { useUpdateAddress } from "./use-update-address";

export function useAddressForm(professional: ProfessionalResponse) {
	const { mutate, isPending } = useUpdateAddress();

	const form = useForm<UpdateAddressInput>({
		resolver: zodResolver(updateAddressSchema),
		defaultValues: {
			city: professional.city ?? "",
			state: professional.state ?? "",
			address: professional.address ?? "",
			zipCode: professional.zipCode ?? "",
			neighborhood: professional.neighborhood ?? "",
			streetNumber: professional.streetNumber ?? "",
			complement: professional.complement ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			city: professional.city ?? "",
			state: professional.state ?? "",
			address: professional.address ?? "",
			zipCode: professional.zipCode ?? "",
			neighborhood: professional.neighborhood ?? "",
			streetNumber: professional.streetNumber ?? "",
			complement: professional.complement ?? "",
		});
	}, [professional, form]);

	function onSubmit(data: UpdateAddressInput) {
		const clean = Object.fromEntries(
			Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]),
		) as UpdateAddressInput;
		mutate(clean, {
			onSuccess: () => toast.success("Endereço atualizado!"),
			onError: () => toast.error("Erro ao salvar endereço."),
		});
	}

	return { form, onSubmit, isPending };
}
