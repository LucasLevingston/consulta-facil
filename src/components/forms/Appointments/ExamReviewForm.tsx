"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useReviewExam } from "@/components/exams/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ExamReviewFormProps } from "./ExamReviewForm.types";

export function ExamReviewForm({ examId }: ExamReviewFormProps) {
	const { mutateAsync: review } = useReviewExam();
	const [reviewNotes, setReviewNotes] = useState("");
	const [reviewing, setReviewing] = useState(false);
	const [showForm, setShowForm] = useState(false);

	async function handleReview() {
		if (!reviewNotes.trim()) return;
		setReviewing(true);
		try {
			await review({ examId, data: { professionalNotes: reviewNotes } });
			toast.success("Observações salvas!");
			setShowForm(false);
		} catch {
			toast.error("Erro ao salvar observações.");
		} finally {
			setReviewing(false);
		}
	}

	if (!showForm) {
		return (
			<Button
				size="sm"
				variant="outline"
				className="gap-2"
				onClick={() => setShowForm(true)}
			>
				<FileText className="h-3.5 w-3.5" />
				Adicionar observações
			</Button>
		);
	}

	return (
		<div className="space-y-2">
			<Textarea
				value={reviewNotes}
				onChange={(e) => setReviewNotes(e.target.value)}
				placeholder="Descreva suas observações sobre o resultado..."
				rows={3}
				className="resize-none text-sm"
			/>
			<div className="flex gap-2">
				<Button size="sm" onClick={handleReview} disabled={reviewing}>
					{reviewing ? "Salvando..." : "Salvar"}
				</Button>
				<Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
					Cancelar
				</Button>
			</div>
		</div>
	);
}
