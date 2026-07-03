import type { ExamRequestResponse } from "@/features/exams";

export const EXAM_STATUS_CONFIG: Record<
	ExamRequestResponse["status"],
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	SCHEDULED: { label: "Agendado", variant: "secondary" },
	UPLOADED: { label: "Enviado", variant: "default" },
	REVIEWED: { label: "Analisado", variant: "outline" },
};
