"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddEducation } from "@/hooks/api/doctors/use-add-education";
import { useDeleteEducation } from "@/hooks/api/doctors/use-delete-education";
import { useUpdateEducation } from "@/hooks/api/doctors/use-update-education";
import {
	degreeTypeOptions,
	type ProfessionalEducationInput,
	professionalEducationSchema,
} from "@/lib/schemas/doctor/professional-education.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

interface EducationListProps {
	professional: ProfessionalResponse;
}

type EducationItem = NonNullable<ProfessionalResponse["education"]>[number];

function EducationDialog({
	open,
	onClose,
	editing,
}: {
	open: boolean;
	onClose: () => void;
	editing?: EducationItem;
}) {
	const add = useAddEducation();
	const update = useUpdateEducation();

	const form = useForm<ProfessionalEducationInput>({
		resolver: zodResolver(professionalEducationSchema),
		defaultValues: {
			degree: editing?.degree ?? "",
			institution: editing?.institution ?? "",
			fieldOfStudy: editing?.fieldOfStudy ?? "",
			graduationYear: editing?.graduationYear ?? undefined,
		},
	});

	function onSubmit(data: ProfessionalEducationInput) {
		if (editing?.id) {
			update.mutate(
				{ educationId: editing.id, data },
				{
					onSuccess: () => {
						toast.success("Formação atualizada!");
						onClose();
					},
					onError: () => toast.error("Erro ao atualizar."),
				},
			);
		} else {
			add.mutate(data, {
				onSuccess: () => {
					toast.success("Formação adicionada!");
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
						{editing ? "Editar formação" : "Nova formação"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="degree"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grau</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{degreeTypeOptions.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
										<Input placeholder="USP, Unicamp..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="fieldOfStudy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Área</FormLabel>
									<FormControl>
										<Input
											placeholder="Medicina, Psicologia..."
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
							name="graduationYear"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ano de conclusão</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="2010"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? null : Number(e.target.value),
												)
											}
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

export function EducationList({ professional }: EducationListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<EducationItem | undefined>();
	const deleteEdu = useDeleteEducation();

	const education = professional.education ?? [];

	function openCreate() {
		setEditing(undefined);
		setDialogOpen(true);
	}

	function openEdit(item: EducationItem) {
		setEditing(item);
		setDialogOpen(true);
	}

	function handleDelete(id: string) {
		deleteEdu.mutate(id, {
			onSuccess: () => toast.success("Formação removida."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Formação acadêmica</CardTitle>
						<CardDescription>
							Graduações, especializações e pós-graduações.
						</CardDescription>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={openCreate}
						className="gap-1"
					>
						<Plus className="h-4 w-4" />
						Adicionar
					</Button>
				</CardHeader>
				<CardContent>
					{education.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhuma formação cadastrada.
						</p>
					) : (
						<ul className="space-y-3">
							{education.map((edu) => (
								<li
									key={edu.id}
									className="flex items-start justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
										<div>
											<p className="text-sm font-medium">{edu.institution}</p>
											<p className="text-xs text-muted-foreground">
												{edu.degree}
												{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
												{edu.graduationYear ? ` (${edu.graduationYear})` : ""}
											</p>
										</div>
									</div>
									<div className="flex gap-1 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => openEdit(edu)}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive hover:text-destructive"
											onClick={() => edu.id && handleDelete(edu.id)}
											disabled={deleteEdu.isPending}
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

			<EducationDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
