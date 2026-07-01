"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ExamRequestResponse } from "@/features/exams";

interface Props {
	isProfessional: boolean;
	examStatus: ExamRequestResponse["status"];
	showReviewForm: boolean;
	setShowReviewForm: (v: boolean) => void;
	reviewNotes: string;
	setReviewNotes: (v: string) => void;
	reviewing: boolean;
	onReview: () => void;
}

export function ExamListItemReviewSection({
	isProfessional,
	examStatus,
	showReviewForm,
	setShowReviewForm,
	reviewNotes,
	setReviewNotes,
	reviewing,
	onReview,
}: Props) {
	return (
		<>
			{isProfessional && examStatus === "UPLOADED" && !showReviewForm && (
				<Button
					size="sm"
					variant="outline"
					className="gap-2"
					onClick={() => setShowReviewForm(true)}
				>
					<FileText className="h-3.5 w-3.5" />
					Adicionar observações
				</Button>
			)}
			{showReviewForm && (
				<div className="space-y-2">
					<Textarea
						value={reviewNotes}
						onChange={(e) => setReviewNotes(e.target.value)}
						placeholder="Descreva suas observações sobre o resultado..."
						rows={3}
						className="resize-none text-sm"
					/>
					<div className="flex gap-2">
						<Button size="sm" onClick={onReview} disabled={reviewing}>
							{reviewing ? "Salvando..." : "Salvar"}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setShowReviewForm(false)}
						>
							Cancelar
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
