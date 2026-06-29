"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
	useClinicReceptionists,
	useInviteReceptionist,
	useRemoveReceptionist,
} from "@/features/clinics";
import {
	type InviteReceptionistInput,
	inviteReceptionistSchema,
} from "@/lib/schemas/clinic/invite-receptionist.schema";

export function ReceptionistsSection({ clinicId }: { clinicId: string }) {
	const { data: receptionists = [], isLoading } =
		useClinicReceptionists(clinicId);
	const { mutateAsync: invite } = useInviteReceptionist(clinicId);
	const { mutateAsync: remove } = useRemoveReceptionist(clinicId);
	const [open, setOpen] = useState(false);

	const form = useForm<InviteReceptionistInput>({
		resolver: zodResolver(inviteReceptionistSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: InviteReceptionistInput) {
		try {
			await invite(values);
			toast.success("Recepcionista adicionado!");
			form.reset();
			setOpen(false);
		} catch {
			toast.error("Erro ao adicionar recepcionista.");
		}
	}

	async function handleRemove(receptionistId: string) {
		try {
			await remove(receptionistId);
			toast.success("Recepcionista removido.");
		} catch {
			toast.error("Erro ao remover recepcionista.");
		}
	}

	if (isLoading) return null;

	return (
		<div className="max-w-2xl space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Recepcionistas
					</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Usuários com acesso à recepção desta clínica.
					</p>
				</div>
				{!open && (
					<Button
						size="sm"
						variant="outline"
						className="gap-2"
						onClick={() => setOpen(true)}
					>
						<UserPlus className="h-3.5 w-3.5" />
						Adicionar
					</Button>
				)}
			</div>

			{open && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-2 items-end"
					>
						<div className="flex-1">
							<CustomFormField
								form={form}
								name="email"
								fieldType={FormFieldType.EMAIL}
								label="E-mail do usuário"
								placeholder="usuario@email.com"
							/>
						</div>
						<CustomSubmitButton form={form} submittingText="Adicionando...">
							Adicionar
						</CustomSubmitButton>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
					</form>
				</Form>
			)}

			{receptionists.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Nenhum recepcionista cadastrado.
				</p>
			) : (
				<div className="space-y-2">
					{receptionists.map((r) => (
						<Card key={r.id}>
							<CardContent className="py-3 flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">{r.name}</p>
									<p className="text-xs text-muted-foreground">{r.email}</p>
								</div>
								<Button
									size="icon"
									variant="ghost"
									className="text-destructive hover:text-destructive"
									onClick={() => handleRemove(r.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
