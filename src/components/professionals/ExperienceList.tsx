"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { useAddExperience } from "@/hooks/api/doctors/use-add-experience";
import { useDeleteExperience } from "@/hooks/api/doctors/use-delete-experience";
import { useUpdateExperience } from "@/hooks/api/doctors/use-update-experience";
import {
	type ProfessionalExperienceInput,
	professionalExperienceSchema,
} from "@/lib/schemas/doctor/professional-experience.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

interface ExperienceListProps {
	professional: ProfessionalResponse;
}

type ExperienceItem = NonNullable<ProfessionalResponse["experience"]>[number];

function ExperienceDialog({
	open,
	onClose,
	editing,
}: {
	open: boolean;
	onClose: () => void;
	editing?: ExperienceItem;
}) {
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

export function ExperienceList({ professional }: ExperienceListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<ExperienceItem | undefined>();
	const deleteExp = useDeleteExperience();

	const experience = professional.experience ?? [];

	function openEdit(item: ExperienceItem) {
		setEditing(item);
		setDialogOpen(true);
	}

	function handleDelete(id: string) {
		deleteExp.mutate(id, {
			onSuccess: () => toast.success("Experiência removida."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">
							Experiência profissional
						</CardTitle>
						<CardDescription>Cargos e instituições onde atuou.</CardDescription>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							setEditing(undefined);
							setDialogOpen(true);
						}}
						className="gap-1"
					>
						<Plus className="h-4 w-4" />
						Adicionar
					</Button>
				</CardHeader>
				<CardContent>
					{experience.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhuma experiência cadastrada.
						</p>
					) : (
						<ul className="space-y-3">
							{experience.map((exp) => (
								<li
									key={exp.id}
									className="flex items-start justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
										<div>
											<p className="text-sm font-medium">{exp.position}</p>
											<p className="text-xs text-muted-foreground">
												{exp.institution} · {exp.startYear}
												{exp.endYear ? `–${exp.endYear}` : "–atual"}
											</p>
											{exp.description && (
												<p className="text-xs text-muted-foreground mt-1">
													{exp.description}
												</p>
											)}
										</div>
									</div>
									<div className="flex gap-1 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => openEdit(exp)}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive hover:text-destructive"
											onClick={() => exp.id && handleDelete(exp.id)}
											disabled={deleteExp.isPending}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			<ExperienceDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
