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
import {
	useDeleteEmergencyContact,
	useEmergencyContacts,
} from "@/features/patients";
import {
	type ContactItem,
	EmergencyContactDialog,
} from "./EmergencyContactDialog";
import { EmergencyContactItem } from "./EmergencyContactItem";

export function EmergencyContactList() {
	const { data: contacts = [] } = useEmergencyContacts();
	const deleteContact = useDeleteEmergencyContact();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<ContactItem | undefined>();

	function openEdit(item: ContactItem) {
		setEditing(item);
		setDialogOpen(true);
	}

	function handleDelete(id: string) {
		deleteContact.mutate(id, {
			onSuccess: () => toast.success("Contato removido."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Contatos de emergência</CardTitle>
						<CardDescription>
							Pessoas a contatar em caso de emergência.
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
					{contacts.length === 0 ? (
						<p className="py-4 text-center text-sm text-muted-foreground">
							Nenhum contato cadastrado.
						</p>
					) : (
						<ul className="space-y-3">
							{contacts.map((c) => (
								<EmergencyContactItem
									key={c.id}
									contact={c}
									onEdit={openEdit}
									onDelete={handleDelete}
									isDeleting={deleteContact.isPending}
								/>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
			<EmergencyContactDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
