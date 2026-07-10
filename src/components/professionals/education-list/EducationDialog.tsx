"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type ProfessionalEducationInput,
	professionalEducationSchema,
} from "@/features/professionals";
import type { EducationDialogProps } from "./EducationDialog.types";
import { EducationDialogForm } from "./EducationDialogForm";
import { useAddEducation } from "./use-add-education";
import { useUpdateEducation } from "./use-update-education";

export function EducationDialog({
	open,
	onClose,
	editing,
}: EducationDialogProps) {
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

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar formação" : "Nova formação"}
					</DialogTitle>
				</DialogHeader>
				<EducationDialogForm
					form={form}
					onSubmit={onSubmit}
					isPending={add.isPending || update.isPending}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
