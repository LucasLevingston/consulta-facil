"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Phone, Plus, Trash2 } from "lucide-react";
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
import { useAddEmergencyContact } from "@/hooks/api/patients/use-add-emergency-contact";
import { useDeleteEmergencyContact } from "@/hooks/api/patients/use-delete-emergency-contact";
import { useEmergencyContacts } from "@/hooks/api/patients/use-emergency-contacts";
import { useUpdateEmergencyContact } from "@/hooks/api/patients/use-update-emergency-contact";
import {
	type EmergencyContactInput,
	emergencyContactSchema,
	RELATIONSHIP_LABELS,
} from "@/lib/schemas/patient/emergency-contact.schema";

type ContactItem = EmergencyContactInput & { id?: string };

function ContactDialog({
	open,
	onClose,
	editing,
}: {
	open: boolean;
	onClose: () => void;
	editing?: ContactItem;
}) {
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

	const isPending = add.isPending || update.isPending;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar contato" : "Novo contato de emergência"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Maria Silva" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="relationship"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Parentesco</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? ""}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(RELATIONSHIP_LABELS).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
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
								name="phone"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Telefone</FormLabel>
										<FormControl>
											<Input placeholder="(11) 99999-0000" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail (opcional)</FormLabel>
									<FormControl>
										<Input
											placeholder="contato@email.com"
											{...field}
											value={field.value ?? ""}
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

			<ContactDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
