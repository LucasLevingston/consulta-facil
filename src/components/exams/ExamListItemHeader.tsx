"use client";

import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExamRequestResponse } from "@/features/exams";
import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";

interface Props {
	exam: ExamRequestResponse;
	isPatient: boolean;
	statusVariant: "default" | "secondary" | "outline";
	statusLabel: string;
}

export function ExamListItemHeader({
	exam,
	isPatient,
	statusVariant,
	statusLabel,
}: Props) {
	return (
		<div className="flex items-start justify-between gap-3">
			<div className="flex items-center gap-2">
				<FlaskConical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
				<div>
					<p className="font-medium">
						{EXAM_TYPE_LABELS[exam.examName] ?? exam.examName}
					</p>
					<p className="text-xs text-muted-foreground">
						{isPatient ? exam.professionalName : exam.patientName}
					</p>
					{exam.instructions && (
						<p className="text-xs text-muted-foreground mt-0.5">
							{exam.instructions}
						</p>
					)}
				</div>
			</div>
			<Badge variant={statusVariant} className="shrink-0 text-xs">
				{statusLabel}
			</Badge>
		</div>
	);
}
