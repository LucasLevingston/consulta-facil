"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { useUpdateEmergencyContact } from "@/hooks/api/patients/use-update-emergency-contact";
import {
	type EmergencyContactInput,
	emergencyContactSchema,
	RELATIONSHIP_LABELS,
} from "@/lib/schemas/patient/emergency-contact.schema";

export type ContactItem = EmergencyContactInput & { id?: string };

interface Props {
	open: boolean;
	onClose: () => void;
	editing?: ContactItem;
}

export function EmergencyContactDialog({ open, onClose, editing }: Props) {
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
