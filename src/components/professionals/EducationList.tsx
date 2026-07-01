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
import { useDeleteEducation } from "@/features/professionals";
import { EducationDialog } from "./EducationDialog";
import type { EducationItem } from "./EducationDialog.types";
import type { EducationListProps } from "./EducationList.types";
import { EducationListItem } from "./EducationListItem";

export function EducationList({ professional }: EducationListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<EducationItem | undefined>();
	const deleteEdu = useDeleteEducation();
	const education = professional.education ?? [];

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
								<EducationListItem
									key={edu.id}
									edu={edu}
									onEdit={(item) => {
										setEditing(item);
										setDialogOpen(true);
									}}
									onDelete={(id) =>
										deleteEdu.mutate(id, {
											onSuccess: () => toast.success("Formação removida."),
											onError: () => toast.error("Erro ao remover."),
										})
									}
									deleting={deleteEdu.isPending}
								/>
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
