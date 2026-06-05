import { api } from "@/config/api";
import type { CreateExamRequestInput } from "@/lib/schemas/examRequest/create-exam-request.schema";
import type { ExamRequestResponse } from "@/lib/schemas/examRequest/exam-request-response.schema";
import type { ReviewExamRequestInput } from "@/lib/schemas/examRequest/review-exam-request.schema";

export const examRequestApi = {
	getByAppointment: async (
		appointmentId: string,
	): Promise<ExamRequestResponse[]> => {
		const response = await api.get<ExamRequestResponse[]>(
			`/appointments/${appointmentId}/exams`,
		);
		return response.data;
	},

	create: async (
		appointmentId: string,
		data: CreateExamRequestInput,
	): Promise<ExamRequestResponse> => {
		const response = await api.post<ExamRequestResponse>(
			`/appointments/${appointmentId}/exams`,
			data,
		);
		return response.data;
	},

	upload: async (examId: string, file: File): Promise<ExamRequestResponse> => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await api.put<ExamRequestResponse>(
			`/exams/${examId}/upload`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return response.data;
	},

	review: async (
		examId: string,
		data: ReviewExamRequestInput,
	): Promise<ExamRequestResponse> => {
		const response = await api.put<ExamRequestResponse>(
			`/exams/${examId}/review`,
			data,
		);
		return response.data;
	},
};
