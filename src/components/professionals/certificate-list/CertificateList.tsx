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
import { CertificateDialog } from "./CertificateDialog";
import type { CertificateItem } from "./CertificateDialog.types";
import type { CertificateListProps } from "./CertificateList.types";
import { CertificateListItem } from "./CertificateListItem";
import { useDeleteCertificate } from "./use-delete-certificate";

export function CertificateList({ professional }: CertificateListProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<CertificateItem | undefined>();
	const deleteCert = useDeleteCertificate();
	const certificates = professional.certificates ?? [];

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
								<CertificateListItem
									key={cert.id}
									cert={cert}
									onEdit={(item) => {
										setEditing(item);
										setDialogOpen(true);
									}}
									onDelete={(id) =>
										deleteCert.mutate(id, {
											onSuccess: () => toast.success("Certificado removido."),
											onError: () => toast.error("Erro ao remover."),
										})
									}
									deleting={deleteCert.isPending}
								/>
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
