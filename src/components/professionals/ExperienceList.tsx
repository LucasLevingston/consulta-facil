"use client";

import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useDeleteExperience } from "@/features/professionals";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import { ExperienceDialog } from "./ExperienceDialog";

type ExperienceItem = NonNullable<ProfessionalResponse["experience"]>[number];

interface Props {
	professional: ProfessionalResponse;
}

export function ExperienceList({ professional }: Props) {
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
