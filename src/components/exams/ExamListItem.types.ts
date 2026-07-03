import type { ExamRequestResponse } from "@/features/exams";

export interface ExamListItemProps {
	exam: ExamRequestResponse;
	isPatient: boolean;
	isProfessional: boolean;
}
