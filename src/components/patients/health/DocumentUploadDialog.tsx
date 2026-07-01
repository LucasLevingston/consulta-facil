"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DOCUMENT_TYPE_LABELS,
	type DocumentType,
	documentTypeSchema,
	useUploadDocument,
} from "@/features/patients";
import type { UploadDialogProps } from "./DocumentPhotoGrid.types";

export function DocumentUploadDialog({
	open,
	onClose,
	file,
}: UploadDialogProps) {
	const upload = useUploadDocument();
	const [docType, setDocType] = useState<DocumentType>("OTHER");
	const [label, setLabel] = useState("");

	function handleSubmit() {
		if (!file) return;
		upload.mutate(
			{ file, documentType: docType, documentLabel: label || undefined },
			{
				onSuccess: () => {
					toast.success("Documento enviado!");
					setDocType("OTHER");
					setLabel("");
					onClose();
				},
				onError: () => toast.error("Erro ao enviar documento."),
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Enviar documento</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{file && (
						<p className="text-sm text-muted-foreground">
							Arquivo: <span className="font-medium">{file.name}</span>
						</p>
					)}
					<div className="space-y-2">
						<Label>Tipo de documento</Label>
						<Select
							value={docType}
							onValueChange={(v) => setDocType(documentTypeSchema.parse(v))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
									<SelectItem key={k} value={k}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Descrição (opcional)</Label>
						<Input
							placeholder="Ex: Carteirinha Unimed"
							value={label}
							onChange={(e) => setLabel(e.target.value)}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>
							Cancelar
						</Button>
						<Button onClick={handleSubmit} disabled={upload.isPending}>
							{upload.isPending ? "Enviando..." : "Enviar"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
