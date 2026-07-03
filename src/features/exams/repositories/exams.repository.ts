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
	getAllLabs: async (): Promise<ExamLabResponse[]> => examLabApi.getAll(),

	getLabsNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ExamLabResponse[]> => examLabApi.getNearby(lat, lng, radiusKm),

	getAvailableSlots: async (
		examLabId: string,
		date: string,
	): Promise<AvailableSlot[]> => examLabApi.getAvailableSlots(examLabId, date),

	scheduleExam: async (data: {
		examRequestId: string;
		examLabId: string;
		scheduledDate: string;
		scheduledTime: string;
		notes?: string;
	}): Promise<ExamSchedulingResponse> => examLabApi.scheduleExam(data),

	cancelScheduling: async (schedulingId: string): Promise<void> =>
		examLabApi.cancelScheduling(schedulingId),

	getMyExams: async (
		status?: ExamRequestStatus,
	): Promise<ExamRequestResponse[]> => examRequestApi.getMy(status),

	getByAppointment: async (
		appointmentId: string,
	): Promise<ExamRequestResponse[]> =>
		examRequestApi.getByAppointment(appointmentId),

	createRequest: async (
		appointmentId: string,
		data: CreateExamRequestInput,
	): Promise<ExamRequestResponse> => examRequestApi.create(appointmentId, data),

	upload: async (examId: string, file: File): Promise<ExamRequestResponse> =>
		examRequestApi.upload(examId, file),

	review: async (
		examId: string,
		data: ReviewExamRequestInput,
	): Promise<ExamRequestResponse> => examRequestApi.review(examId, data),
};
