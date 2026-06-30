"use client";

import { Pencil, Phone, Plus, Trash2 } from "lucide-react";
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
	RELATIONSHIP_LABELS,
	useDeleteEmergencyContact,
	useEmergencyContacts,
} from "@/features/patients";
import {
	type ContactItem,
	EmergencyContactDialog,
} from "./EmergencyContactDialog";

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
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhum contato cadastrado.
						</p>
					) : (
						<ul className="space-y-3">
							{contacts.map((c) => (
								<li
									key={c.id}
									className="flex items-start justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<Phone className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
										<div>
											<p className="text-sm font-medium">
												{c.name}
												{c.relationship && (
													<span className="ml-2 text-xs text-muted-foreground">
														{RELATIONSHIP_LABELS[c.relationship] ??
															c.relationship}
													</span>
												)}
											</p>
											<p className="text-xs text-muted-foreground">
												{c.phone}
												{c.email ? ` · ${c.email}` : ""}
											</p>
										</div>
									</div>
									<div className="flex gap-1 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => openEdit(c)}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive hover:text-destructive"
											onClick={() => c.id && handleDelete(c.id)}
											disabled={deleteContact.isPending}
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

			<EmergencyContactDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
