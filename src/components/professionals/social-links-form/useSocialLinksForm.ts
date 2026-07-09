"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type UpdateSocialLinksInput,
	updateSocialLinksSchema,
	useUpdateSocialLinks,
} from "@/features/professionals";
import type { SocialLinksFormProps } from "./SocialLinksForm.types";

export function useSocialLinksForm({ professional }: SocialLinksFormProps) {
	const { mutate, isPending } = useUpdateSocialLinks();
	const form = useForm<UpdateSocialLinksInput>({
		resolver: zodResolver(updateSocialLinksSchema),
		defaultValues: {
			instagramUrl: professional.instagramUrl ?? "",
			linkedinUrl: professional.linkedinUrl ?? "",
			websiteUrl: professional.websiteUrl ?? "",
			facebookUrl: professional.facebookUrl ?? "",
		},
	});
	useEffect(() => {
		form.reset({
			instagramUrl: professional.instagramUrl ?? "",
			linkedinUrl: professional.linkedinUrl ?? "",
			websiteUrl: professional.websiteUrl ?? "",
			facebookUrl: professional.facebookUrl ?? "",
		});
	}, [professional, form]);
	function onSubmit(data: UpdateSocialLinksInput) {
		const payload = {
			instagramUrl: data.instagramUrl || null,
			linkedinUrl: data.linkedinUrl || null,
			websiteUrl: data.websiteUrl || null,
			facebookUrl: data.facebookUrl || null,
		};
		mutate(payload, {
			onSuccess: () => toast.success("Redes sociais atualizadas!"),
			onError: () => toast.error("Erro ao salvar links."),
		});
	}
	return { form, isPending, onSubmit };
}
