"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBio } from "@/features/professionals";
import {
	type UpdateBioInput,
	updateBioSchema,
} from "@/lib/schemas/doctor/update-bio.schema";
import type { BioFormProps } from "./BioForm.types";

export function BioForm({ professional }: BioFormProps) {
	const { mutate, isPending } = useUpdateBio();

	const form = useForm<UpdateBioInput>({
		resolver: zodResolver(updateBioSchema),
		defaultValues: { bio: professional.bio ?? "" },
	});

	useEffect(() => {
		form.reset({ bio: professional.bio ?? "" });
	}, [professional, form]);

	const bio = form.watch("bio") ?? "";

	function onSubmit(data: UpdateBioInput) {
		mutate(
			{ bio: data.bio || null },
			{
				onSuccess: () => toast.success("Bio atualizada!"),
				onError: () => toast.error("Erro ao salvar bio."),
			},
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Sobre mim</CardTitle>
				<CardDescription>
					Apresentação exibida no seu perfil público. Máx. 1000 caracteres.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Conte um pouco sobre sua formação, experiência e abordagem..."
											className="min-h-[120px] resize-y"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<div className="flex items-center justify-between">
										<FormMessage />
										<span className="text-xs text-muted-foreground ml-auto">
											{bio.length}/1000
										</span>
									</div>
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
