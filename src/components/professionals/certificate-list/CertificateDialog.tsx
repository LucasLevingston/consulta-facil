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
	type ProfessionalCertificateInput,
	professionalCertificateSchema,
} from "@/features/professionals";
import type { CertificateDialogProps } from "./CertificateDialog.types";
import { CertificateDialogForm } from "./CertificateDialogForm";
import { useAddCertificate } from "./use-add-certificate";
import { useUpdateCertificate } from "./use-update-certificate";

export function CertificateDialog({
	open,
	onClose,
	editing,
}: CertificateDialogProps) {
	const add = useAddCertificate();
	const update = useUpdateCertificate();

	const form = useForm<ProfessionalCertificateInput>({
		resolver: zodResolver(professionalCertificateSchema),
		defaultValues: {
			title: editing?.title ?? "",
			issuingOrganization: editing?.issuingOrganization ?? "",
			issueYear: editing?.issueYear ?? undefined,
			certificateUrl: editing?.certificateUrl ?? "",
		},
	});

	function onSubmit(data: ProfessionalCertificateInput) {
		const clean = {
			...data,
			issuingOrganization: data.issuingOrganization || null,
			certificateUrl: data.certificateUrl || null,
		};
		if (editing?.id) {
			update.mutate(
				{ certificateId: editing.id, data: clean },
				{
					onSuccess: () => {
						toast.success("Certificado atualizado!");
						onClose();
					},
					onError: () => toast.error("Erro ao atualizar."),
				},
			);
		} else {
			add.mutate(clean, {
				onSuccess: () => {
					toast.success("Certificado adicionado!");
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
						{editing ? "Editar certificado" : "Novo certificado"}
					</DialogTitle>
				</DialogHeader>
				<CertificateDialogForm
					form={form}
					onSubmit={onSubmit}
					isPending={add.isPending || update.isPending}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
