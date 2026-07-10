"use client";

import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DOCUMENT_TYPE_LABELS,
	type PatientDocumentResponse,
	useDeleteDocument,
} from "@/features/patients";

interface Props {
	documents: PatientDocumentResponse[];
}

export function DocumentPhotoGridList({ documents }: Props) {
	const deleteDoc = useDeleteDocument();

	function handleDelete(id: string) {
		deleteDoc.mutate(id, {
			onSuccess: () => toast.success("Documento removido."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	if (documents.length === 0) {
		return (
			<p className="text-sm text-muted-foreground text-center py-4">
				Nenhum documento enviado.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{documents.map((doc) => (
				<div key={doc.id} className="relative rounded-lg border p-3 space-y-2">
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-muted-foreground shrink-0" />
						<p className="text-xs font-medium truncate">
							{DOCUMENT_TYPE_LABELS[doc.documentType] ?? doc.documentType}
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
	);
}
