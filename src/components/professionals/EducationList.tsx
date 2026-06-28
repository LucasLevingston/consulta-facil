"use client";

import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useDeleteEducation } from "@/hooks/api/professionals/use-delete-education";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import { EducationDialog } from "./EducationDialog";

type EducationItem = NonNullable<ProfessionalResponse["education"]>[number];

interface Props {
	professional: ProfessionalResponse;
}

export function EducationList({ professional }: Props) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<EducationItem | undefined>();
	const deleteEdu = useDeleteEducation();

	const education = professional.education ?? [];

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
