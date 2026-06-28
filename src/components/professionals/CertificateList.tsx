"use client";

import { Award, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useDeleteCertificate } from "@/hooks/api/professionals/use-delete-certificate";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import { CertificateDialog } from "./CertificateDialog";

type CertificateItem = NonNullable<
	ProfessionalResponse["certificates"]
>[number];

interface Props {
	professional: ProfessionalResponse;
}

export function CertificateList({ professional }: Props) {
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
