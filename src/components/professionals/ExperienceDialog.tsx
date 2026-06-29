"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useAddExperience,
	useUpdateExperience,
} from "@/features/professionals";
import {
	type ProfessionalExperienceInput,
	professionalExperienceSchema,
} from "@/lib/schemas/doctor/professional-experience.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

type ExperienceItem = NonNullable<ProfessionalResponse["experience"]>[number];

interface Props {
	open: boolean;
	onClose: () => void;
	editing?: ExperienceItem;
}

export function ExperienceDialog({ open, onClose, editing }: Props) {
	const add = useAddExperience();
	const update = useUpdateExperience();

	const form = useForm<ProfessionalExperienceInput>({
		resolver: zodResolver(professionalExperienceSchema),
		defaultValues: {
			position: editing?.position ?? "",
			institution: editing?.institution ?? "",
			startYear: editing?.startYear ?? new Date().getFullYear(),
			endYear: editing?.endYear ?? undefined,
			description: editing?.description ?? "",
		},
	});

	function onSubmit(data: ProfessionalExperienceInput) {
		if (editing?.id) {
			update.mutate(
				{ experienceId: editing.id, data },
				{
					onSuccess: () => {
						toast.success("Experiência atualizada!");
						onClose();
					},
					onError: () => toast.error("Erro ao atualizar."),
				},
			);
		} else {
			add.mutate(data, {
				onSuccess: () => {
					toast.success("Experiência adicionada!");
					onClose();
				},
				onError: () => toast.error("Erro ao adicionar."),
			});
		}
	}

	const isPending = add.isPending || update.isPending;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar experiência" : "Nova experiência"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cargo</FormLabel>
									<FormControl>
										<Input
											placeholder="Cardiologista, Clínico Geral..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="institution"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Instituição</FormLabel>
									<FormControl>
										<Input placeholder="Hospital das Clínicas..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="startYear"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Ano início</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="2015"
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value),
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endYear"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Ano fim (deixe vazio se atual)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="2020"
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? null
															: Number(e.target.value),
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição (opcional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descreva suas atividades..."
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
