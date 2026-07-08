import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import type { AvailableSlot } from "@/lib/schemas/examLab/available-slot.schema";
import type { ExamLabResponse } from "@/lib/schemas/examLab/exam-lab-response.schema";
import type { ExamSchedulingResponse } from "@/lib/schemas/examLab/exam-scheduling-response.schema";
import type { CreateExamRequestInput } from "@/lib/schemas/examRequest/create-exam-request.schema";
import type { ExamRequestResponse } from "@/lib/schemas/examRequest/exam-request-response.schema";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";
import type { ReviewExamRequestInput } from "@/lib/schemas/examRequest/review-exam-request.schema";

export const examsRepository = {
	getAllLabs: (): Promise<ExamLabResponse[]> => examLabApi.getAll(),

	getLabsNearby: (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ExamLabResponse[]> => examLabApi.getNearby(lat, lng, radiusKm),

	getAvailableSlots: (
		examLabId: string,
		date: string,
	): Promise<AvailableSlot[]> => examLabApi.getAvailableSlots(examLabId, date),

	scheduleExam: (data: {
		examRequestId: string;
		examLabId: string;
		scheduledDate: string;
		scheduledTime: string;
		notes?: string;
	}): Promise<ExamSchedulingResponse> => examLabApi.scheduleExam(data),

	cancelScheduling: (schedulingId: string): Promise<void> =>
		examLabApi.cancelScheduling(schedulingId),

	getMyExams: (status?: ExamRequestStatus): Promise<ExamRequestResponse[]> =>
		examRequestApi.getMy(status),

	getExamsByAppointment: (
		appointmentId: string,
	): Promise<ExamRequestResponse[]> =>
		examRequestApi.getByAppointment(appointmentId),

	createExamRequest: (
		appointmentId: string,
		data: CreateExamRequestInput,
	): Promise<ExamRequestResponse> => examRequestApi.create(appointmentId, data),

	uploadExamResult: (
		examId: string,
		file: File,
	): Promise<ExamRequestResponse> => examRequestApi.upload(examId, file),

	reviewExam: (
		examId: string,
		data: ReviewExamRequestInput,
	): Promise<ExamRequestResponse> => examRequestApi.review(examId, data),
};
