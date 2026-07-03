"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
	type UpdateCouncilInput,
	updateCouncilSchema,
	useUpdateCouncil,
} from "@/features/professionals";
import type { CouncilFormProps } from "./CouncilForm.types";
import { CouncilFormFields } from "./CouncilFormFields";

export function CouncilForm({ professional }: CouncilFormProps) {
	const { mutate, isPending } = useUpdateCouncil();

	const form = useForm<UpdateCouncilInput>({
		resolver: zodResolver(updateCouncilSchema),
		defaultValues: {
			councilType: professional.councilType ?? "",
			councilState: professional.councilState ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			councilType: professional.councilType ?? "",
			councilState: professional.councilState ?? "",
		});
	}, [professional, form]);

	function onSubmit(data: UpdateCouncilInput) {
		mutate(
			{
				councilType: data.councilType || null,
				councilState: data.councilState || null,
			},
			{
				onSuccess: () => toast.success("Conselho atualizado!"),
				onError: () => toast.error("Erro ao salvar conselho."),
			},
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Conselho profissional</CardTitle>
				<CardDescription>
					Seu conselho de classe (ex: CRM 12345/SP).
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<CouncilFormFields
						control={form.control}
						onSubmit={form.handleSubmit(onSubmit)}
						isPending={isPending}
					/>
				</Form>
			</CardContent>
		</Card>
	);
}
