"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useAddCertificate } from "@/hooks/api/doctors/use-add-certificate";
import { useDeleteCertificate } from "@/hooks/api/doctors/use-delete-certificate";
import { useUpdateCertificate } from "@/hooks/api/doctors/use-update-certificate";
import {
	type ProfessionalCertificateInput,
	professionalCertificateSchema,
} from "@/lib/schemas/doctor/professional-certificate.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

interface CertificateListProps {
	professional: ProfessionalResponse;
}

type CertificateItem = NonNullable<
	ProfessionalResponse["certificates"]
>[number];

function CertificateDialog({
	open,
	onClose,
	editing,
}: {
	open: boolean;
	onClose: () => void;
	editing?: CertificateItem;
}) {
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

export function CertificateList({ professional }: CertificateListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<CertificateItem | undefined>();
	const deleteCert = useDeleteCertificate();

	const certificates = professional.certificates ?? [];

	function openEdit(item: CertificateItem) {
		setEditing(item);
		setDialogOpen(true);
	}

	function handleDelete(id: string) {
		deleteCert.mutate(id, {
			onSuccess: () => toast.success("Certificado removido."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Certificados</CardTitle>
						<CardDescription>
							Cursos, certificações e qualificações extras.
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
					{certificates.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhum certificado cadastrado.
						</p>
					) : (
						<ul className="space-y-3">
							{certificates.map((cert) => (
								<li
									key={cert.id}
									className="flex items-start justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<Award className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
										<div>
											<div className="flex items-center gap-1">
												<p className="text-sm font-medium">{cert.title}</p>
												{cert.certificateUrl && (
													<a
														href={cert.certificateUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-primary"
													>
														<ExternalLink className="h-3 w-3" />
													</a>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{cert.issuingOrganization}
												{cert.issueYear ? ` · ${cert.issueYear}` : ""}
											</p>
										</div>
									</div>
									<div className="flex gap-1 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => openEdit(cert)}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive hover:text-destructive"
											onClick={() => cert.id && handleDelete(cert.id)}
											disabled={deleteCert.isPending}
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

			<CertificateDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</>
	);
}
