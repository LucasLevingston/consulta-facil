import type { ExamLabResponse } from "@/features/exams";

export interface LabCardProps {
	lab: ExamLabResponse;
	examRequestId: string | null;
}
