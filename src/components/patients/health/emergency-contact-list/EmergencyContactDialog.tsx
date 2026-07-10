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
	type EmergencyContactInput,
	emergencyContactSchema,
	useAddEmergencyContact,
	useUpdateEmergencyContact,
} from "@/features/patients";
import type { EmergencyContactDialogProps } from "./EmergencyContactDialog.types";
import { EmergencyContactDialogForm } from "./EmergencyContactDialogForm";

export type { ContactItem } from "./EmergencyContactDialog.types";

export function EmergencyContactDialog({
	open,
	onClose,
	editing,
}: EmergencyContactDialogProps) {
	const add = useAddEmergencyContact();
	const update = useUpdateEmergencyContact();

	const form = useForm<EmergencyContactInput>({
		resolver: zodResolver(emergencyContactSchema),
		defaultValues: {
			name: editing?.name ?? "",
			phone: editing?.phone ?? "",
			email: editing?.email ?? "",
			relationship: editing?.relationship,
		},
	});

	function onSubmit(data: EmergencyContactInput) {
		if (editing?.id) {
			update.mutate(
				{ id: editing.id, data },
				{
					onSuccess: () => {
						toast.success("Contato atualizado!");
						onClose();
					},
					onError: () => toast.error("Erro ao atualizar."),
				},
			);
		} else {
			add.mutate(data, {
				onSuccess: () => {
					toast.success("Contato adicionado!");
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
						{editing ? "Editar contato" : "Novo contato de emergência"}
					</DialogTitle>
				</DialogHeader>
				<EmergencyContactDialogForm
					form={form}
					onSubmit={onSubmit}
					isPending={add.isPending || update.isPending}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
