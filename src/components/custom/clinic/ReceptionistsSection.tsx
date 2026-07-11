"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	type InviteReceptionistInput,
	inviteReceptionistSchema,
} from "@/features/clinics";
import { ReceptionistInviteForm } from "./ReceptionistInviteForm";
import { ReceptionistList } from "./ReceptionistList";
import type { ReceptionistsSectionProps } from "./ReceptionistsSection.types";
import { useClinicReceptionists } from "./use-clinic-receptionists";
import { useInviteReceptionist } from "./use-invite-receptionist";
import { useRemoveReceptionist } from "./use-remove-receptionist";

export function ReceptionistsSection({ clinicId }: ReceptionistsSectionProps) {
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
				<ReceptionistInviteForm
					form={form}
					onSubmit={form.handleSubmit(onSubmit)}
					onCancel={() => setOpen(false)}
				/>
			)}
			{receptionists.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Nenhum recepcionista cadastrado.
				</p>
			) : (
				<ReceptionistList
					receptionists={receptionists}
					onRemove={handleRemove}
				/>
			)}
		</div>
	);
}
