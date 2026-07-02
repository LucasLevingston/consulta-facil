"use client";

import { ExternalLink, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SocialLinkField } from "./SocialLinkField";
import type { SocialLinksFormProps } from "./SocialLinksForm.types";
import { useSocialLinksForm } from "./useSocialLinksForm";

export function SocialLinksForm({ professional }: SocialLinksFormProps) {
	const { form, isPending, onSubmit } = useSocialLinksForm({ professional });
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
