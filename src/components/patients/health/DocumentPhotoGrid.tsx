"use client";

import { ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
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
	useDeleteDocument,
	usePatientDocuments,
	useUploadDocument,
} from "@/features/patients";
import type { UploadDialogProps } from "./DocumentPhotoGrid.types";

function UploadDialog({ open, onClose, file }: UploadDialogProps) {
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

export function DocumentPhotoGrid() {
	const { data: documents = [] } = usePatientDocuments();
	const deleteDoc = useDeleteDocument();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelectedFile(file);
		setUploadDialogOpen(true);
		e.target.value = "";
	}

	function handleDelete(id: string) {
		deleteDoc.mutate(id, {
			onSuccess: () => toast.success("Documento removido."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Documentos</CardTitle>
						<CardDescription>
							RG, CPF, CNH, carteirinha do plano e outros.
						</CardDescription>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						className="gap-1"
					>
						<Plus className="h-4 w-4" />
						Enviar
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.jpg,.jpeg,.png"
						className="hidden"
						onChange={handleFileChange}
					/>
				</CardHeader>
				<CardContent>
					{documents.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhum documento enviado.
						</p>
					) : (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{documents.map((doc) => (
								<div
									key={doc.id}
									className="relative rounded-lg border p-3 space-y-2"
								>
									<div className="flex items-center gap-2">
										<FileText className="h-5 w-5 text-muted-foreground shrink-0" />
										<p className="text-xs font-medium truncate">
											{DOCUMENT_TYPE_LABELS[doc.documentType] ??
												doc.documentType}
										</p>
									</div>
									{doc.documentLabel && (
										<p className="text-xs text-muted-foreground truncate">
											{doc.documentLabel}
										</p>
									)}
									<div className="flex gap-1">
										<a
											href={doc.fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1"
										>
											<Button
												size="sm"
												variant="outline"
												className="w-full h-7 text-xs gap-1"
											>
												<ExternalLink className="h-3 w-3" />
												Ver
											</Button>
										</a>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive hover:text-destructive"
											onClick={() => doc.id && handleDelete(doc.id)}
											disabled={deleteDoc.isPending}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<UploadDialog
				open={uploadDialogOpen}
				file={selectedFile}
				onClose={() => {
					setUploadDialogOpen(false);
					setSelectedFile(null);
				}}
			/>
		</>
	);
}
