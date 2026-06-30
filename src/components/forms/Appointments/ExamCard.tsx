"use client";

import { CheckCircle, FlaskConical, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EXAM_STATUS_CONFIG } from "@/lib/constants/exam-status-config";
import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";
import type { ExamCardProps } from "./ExamCard.types";
import { ExamReviewForm } from "./ExamReviewForm";
import { ExamUploadButton } from "./ExamUploadButton";

export function ExamCard({ exam, isPatient, isProfessional }: ExamCardProps) {
	const statusCfg = EXAM_STATUS_CONFIG[exam.status];

	return (
		<div className="space-y-2">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<FlaskConical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p className="text-sm font-medium">
							{EXAM_TYPE_LABELS[exam.examName] ?? exam.examName}
						</p>
						{exam.instructions && (
							<p className="text-xs text-muted-foreground mt-0.5">
								{exam.instructions}
							</p>
						)}
					</div>
				</div>
				<Badge variant={statusCfg.variant} className="shrink-0 text-xs">
					{statusCfg.label}
				</Badge>
			</div>

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

			{isPatient && exam.status === "PENDING" && (
				<ExamUploadButton examId={exam.id} />
			)}
			{isProfessional && exam.status === "UPLOADED" && (
				<ExamReviewForm examId={exam.id} />
			)}
		</div>
	);
}
