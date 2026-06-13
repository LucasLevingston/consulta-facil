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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateSocialLinks } from "@/hooks/api/doctors/use-update-social-links";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import {
	type UpdateSocialLinksInput,
	updateSocialLinksSchema,
} from "@/lib/schemas/doctor/update-social-links.schema";

interface SocialLinksFormProps {
	professional: ProfessionalResponse;
}

export function SocialLinksForm({ professional }: SocialLinksFormProps) {
	const { mutate, isPending } = useUpdateSocialLinks();

	const form = useForm<UpdateSocialLinksInput>({
		resolver: zodResolver(updateSocialLinksSchema),
		defaultValues: {
			instagramUrl: professional.instagramUrl ?? "",
			linkedinUrl: professional.linkedinUrl ?? "",
			websiteUrl: professional.websiteUrl ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			instagramUrl: professional.instagramUrl ?? "",
			linkedinUrl: professional.linkedinUrl ?? "",
			websiteUrl: professional.websiteUrl ?? "",
		});
	}, [professional, form]);

	function onSubmit(data: UpdateSocialLinksInput) {
		const payload = {
			instagramUrl: data.instagramUrl || null,
			linkedinUrl: data.linkedinUrl || null,
			websiteUrl: data.websiteUrl || null,
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
						<FormField
							control={form.control}
							name="instagramUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<ExternalLink className="h-4 w-4" />
										Instagram
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://instagram.com/seu_usuario"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="linkedinUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<ExternalLink className="h-4 w-4" />
										LinkedIn
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://linkedin.com/in/seu_usuario"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="websiteUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Globe className="h-4 w-4" />
										Website
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://seusite.com.br"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
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
