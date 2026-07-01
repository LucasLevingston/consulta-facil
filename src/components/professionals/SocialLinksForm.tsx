"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Globe, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
	type UpdateSocialLinksInput,
	updateSocialLinksSchema,
	useUpdateSocialLinks,
} from "@/features/professionals";
import { SocialLinkField } from "./SocialLinkField";
import type { SocialLinksFormProps } from "./SocialLinksForm.types";

export function SocialLinksForm({ professional }: SocialLinksFormProps) {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Redes sociais</CardTitle>
				<CardDescription>Links exibidos no seu perfil público.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<SocialLinkField
							control={form.control}
							name="instagramUrl"
							label="Instagram"
							placeholder="https://instagram.com/seu_usuario"
							icon={<ExternalLink className="h-4 w-4" />}
						/>
						<SocialLinkField
							control={form.control}
							name="linkedinUrl"
							label="LinkedIn"
							placeholder="https://linkedin.com/in/seu_usuario"
							icon={<ExternalLink className="h-4 w-4" />}
						/>
						<SocialLinkField
							control={form.control}
							name="websiteUrl"
							label="Website"
							placeholder="https://seusite.com.br"
							icon={<Globe className="h-4 w-4" />}
						/>
						<SocialLinkField
							control={form.control}
							name="facebookUrl"
							label="Facebook"
							placeholder="https://facebook.com/seu_usuario"
							icon={<ExternalLink className="h-4 w-4" />}
						/>
						<Button type="submit" disabled={isPending} className="gap-2">
							<Save className="h-4 w-4" />
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
