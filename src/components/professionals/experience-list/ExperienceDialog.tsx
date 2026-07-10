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
	type ProfessionalExperienceInput,
	professionalExperienceSchema,
} from "@/features/professionals";
import type { ExperienceDialogProps } from "./ExperienceDialog.types";
import { ExperienceDialogForm } from "./ExperienceDialogForm";
import { useAddExperience } from "./use-add-experience";
import { useUpdateExperience } from "./use-update-experience";

export function ExperienceDialog({
	open,
	onClose,
	editing,
}: ExperienceDialogProps) {
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

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar experiência" : "Nova experiência"}
					</DialogTitle>
				</DialogHeader>
				<ExperienceDialogForm
					form={form}
					onSubmit={onSubmit}
					isPending={add.isPending || update.isPending}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
