"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { useUploadExamResult } from "@/components/exams/hooks";
import { Button } from "@/components/ui/button";
import type { ExamUploadButtonProps } from "./ExamUploadButton.types";

export function ExamUploadButton({ examId }: ExamUploadButtonProps) {
	const { mutateAsync: upload } = useUploadExamResult();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			await upload({ examId, file });
			toast.success("Arquivo enviado com sucesso!");
		} catch {
			toast.error("Erro ao enviar arquivo.");
		} finally {
			setUploading(false);
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept=".pdf,.jpg,.jpeg,.png"
				className="hidden"
				onChange={handleUpload}
			/>
			<Button
				size="sm"
				variant="outline"
				className="gap-2"
				disabled={uploading}
				onClick={() => fileInputRef.current?.click()}
			>
				<Upload className="h-3.5 w-3.5" />
				{uploading ? "Enviando..." : "Enviar resultado"}
			</Button>
		</>
	);
}
