"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DocumentPhotoGridList } from "./DocumentPhotoGridList";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { usePatientDocuments } from "./use-patient-documents";

export function DocumentPhotoGrid() {
	const { data: documents = [] } = usePatientDocuments();
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
					<DocumentPhotoGridList documents={documents} />
				</CardContent>
			</Card>
			<DocumentUploadDialog
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
