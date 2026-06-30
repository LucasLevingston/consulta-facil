import type { ExamRequestResponse } from "@/features/exams";

export interface ExamCardProps {
	exam: ExamRequestResponse;
	isPatient: boolean;
	isProfessional: boolean;
}
