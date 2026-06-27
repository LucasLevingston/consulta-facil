import type { ExamRequestResponse } from "@/lib/schemas/examRequest/exam-request-response.schema";

export interface ExamCardProps {
	exam: ExamRequestResponse;
	isPatient: boolean;
	isProfessional: boolean;
}
