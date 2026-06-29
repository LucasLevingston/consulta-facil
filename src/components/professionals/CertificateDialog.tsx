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
	useAddCertificate,
	useUpdateCertificate,
} from "@/features/professionals";
import {
	type ProfessionalCertificateInput,
	professionalCertificateSchema,
} from "@/lib/schemas/doctor/professional-certificate.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

type CertificateItem = NonNullable<
	ProfessionalResponse["certificates"]
>[number];

interface Props {
	open: boolean;
	onClose: () => void;
	editing?: CertificateItem;
}

export function CertificateDialog({ open, onClose, editing }: Props) {
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

	const isPending = add.isPending || update.isPending;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar certificado" : "Novo certificado"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Título</FormLabel>
									<FormControl>
										<Input placeholder="ACLS, BLS, MBA..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="issuingOrganization"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Instituição emissora</FormLabel>
									<FormControl>
										<Input
											placeholder="AHA, CFM..."
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="issueYear"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ano de emissão</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="2021"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? null : Number(e.target.value),
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="certificateUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Link do certificado (opcional)</FormLabel>
									<FormControl>
										<Input
											placeholder="https://..."
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
