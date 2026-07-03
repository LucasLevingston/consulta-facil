"use client";

import { Plus } from "lucide-react";
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
import { ExperienceDialog } from "./ExperienceDialog";
import type { ExperienceItem } from "./ExperienceDialog.types";
import type { ExperienceListProps } from "./ExperienceList.types";
import { ExperienceListItem } from "./ExperienceListItem";

export function ExperienceList({ professional }: ExperienceListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<ExperienceItem | undefined>();
	const deleteExp = useDeleteExperience();
	const experience = professional.experience ?? [];

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
								<ExperienceListItem
									key={exp.id}
									exp={exp}
									onEdit={(item) => {
										setEditing(item);
										setDialogOpen(true);
									}}
									onDelete={(id) =>
										deleteExp.mutate(id, {
											onSuccess: () => toast.success("Experiência removida."),
											onError: () => toast.error("Erro ao remover."),
										})
									}
									deleting={deleteExp.isPending}
								/>
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
