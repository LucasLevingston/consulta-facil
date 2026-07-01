"use client";

import { CheckCircle, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ExamRequestResponse } from "@/features/exams";
import type { ExamListItemProps } from "./ExamListItem.types";
import { ExamListItemHeader } from "./ExamListItemHeader";
import { ExamListItemPatientActions } from "./ExamListItemPatientActions";
import { ExamListItemReviewSection } from "./ExamListItemReviewSection";
import { ExamListItemSchedulingInfo } from "./ExamListItemSchedulingInfo";
import { useExamListItem } from "./useExamListItem";

const STATUS_CONFIG: Record<
	ExamRequestResponse["status"],
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	SCHEDULED: { label: "Agendado", variant: "default" },
	UPLOADED: { label: "Enviado", variant: "default" },
	REVIEWED: { label: "Analisado", variant: "outline" },
};

export function ExamListItem({
	exam,
	isPatient,
	isProfessional,
}: ExamListItemProps) {
	const handlers = useExamListItem(exam);
	const statusCfg = STATUS_CONFIG[exam.status];

	return (
		<Card>
			<CardContent className="p-5 space-y-3">
				<ExamListItemHeader
					exam={exam}
					isPatient={isPatient}
					statusVariant={statusCfg.variant}
					statusLabel={statusCfg.label}
				/>
				{exam.fileUrl && (
					<a
						href={exam.fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-xs text-primary hover:underline"
					>
						<Paperclip className="h-3 w-3" />
						{exam.fileName ?? "Ver arquivo"}
					</a>
				)}
				{exam.professionalNotes && (
					<div className="rounded-lg bg-muted/50 p-3">
						<p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
							<CheckCircle className="h-3 w-3" />
							Observações do profissional
						</p>
						<p className="text-sm leading-relaxed">{exam.professionalNotes}</p>
					</div>
				)}
				{isPatient && exam.status === "SCHEDULED" && exam.labName && (
					<ExamListItemSchedulingInfo exam={exam} />
				)}
				{isPatient &&
					(exam.status === "PENDING" || exam.status === "SCHEDULED") && (
						<ExamListItemPatientActions
							exam={exam}
							cancelling={handlers.cancelling}
							uploading={handlers.uploading}
							fileInputRef={handlers.fileInputRef}
							onCancelScheduling={handlers.handleCancelScheduling}
							onUpload={handlers.handleUpload}
						/>
					)}
				<ExamListItemReviewSection
					isProfessional={isProfessional}
					examStatus={exam.status}
					showReviewForm={handlers.showReviewForm}
					setShowReviewForm={handlers.setShowReviewForm}
					reviewNotes={handlers.reviewNotes}
					setReviewNotes={handlers.setReviewNotes}
					reviewing={handlers.reviewing}
					onReview={handlers.handleReview}
				/>
			</CardContent>
		</Card>
	);
}
