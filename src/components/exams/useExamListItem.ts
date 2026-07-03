"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ExamRequestResponse } from "@/features/exams";
import {
	useCancelExamScheduling,
	useReviewExam,
	useUploadExamResult,
} from "@/features/exams";

export function useExamListItem(exam: ExamRequestResponse) {
	const { mutateAsync: upload } = useUploadExamResult();
	const { mutateAsync: review } = useReviewExam();
	const { mutateAsync: cancelScheduling, isPending: cancelling } =
		useCancelExamScheduling();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [reviewNotes, setReviewNotes] = useState("");
	const [reviewing, setReviewing] = useState(false);
	const [showReviewForm, setShowReviewForm] = useState(false);

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			await upload({ examId: exam.id, file });
			toast.success("Arquivo enviado com sucesso!");
		} catch {
			toast.error("Erro ao enviar arquivo.");
		} finally {
			setUploading(false);
		}
	}

	async function handleCancelScheduling() {
		if (!exam.schedulingId) return;
		try {
			await cancelScheduling(exam.schedulingId);
			toast.success("Agendamento cancelado.");
		} catch {
			toast.error("Erro ao cancelar agendamento.");
		}
	}

	async function handleReview() {
		if (!reviewNotes.trim()) return;
		setReviewing(true);
		try {
			await review({
				examId: exam.id,
				data: { professionalNotes: reviewNotes },
			});
			toast.success("Observações salvas!");
			setShowReviewForm(false);
		} catch {
			toast.error("Erro ao salvar observações.");
		} finally {
			setReviewing(false);
		}
	}

	return {
		fileInputRef,
		uploading,
		reviewNotes,
		setReviewNotes,
		reviewing,
		showReviewForm,
		setShowReviewForm,
		cancelling,
		handleUpload,
		handleCancelScheduling,
		handleReview,
	};
}
