import { api } from "@/config/api";
import type { AvailableSlot } from "@/lib/schemas/examLab/available-slot.schema";
import type { ExamLabResponse } from "@/lib/schemas/examLab/exam-lab-response.schema";
import type { ExamSchedulingResponse } from "@/lib/schemas/examLab/exam-scheduling-response.schema";

export const examLabApi = {
	getAll: async (): Promise<ExamLabResponse[]> => {
		const response = await api.get<ExamLabResponse[]>("/exam-labs");
		return response.data;
	},

	getById: async (id: string): Promise<ExamLabResponse> => {
		const response = await api.get<ExamLabResponse>(`/exam-labs/${id}`);
		return response.data;
	},

	getNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ExamLabResponse[]> => {
		const response = await api.get<ExamLabResponse[]>("/exam-labs/nearby", {
			params: { lat, lng, radiusKm },
		});
		return response.data;
	},

	getAvailableSlots: async (
		examLabId: string,
		date: string,
	): Promise<AvailableSlot[]> => {
		const response = await api.get<AvailableSlot[]>(
			`/exam-labs/${examLabId}/available-slots`,
			{ params: { date } },
		);
		return response.data;
	},

	scheduleExam: async (data: {
		examRequestId: string;
		examLabId: string;
		scheduledDate: string;
		scheduledTime: string;
		notes?: string;
	}): Promise<ExamSchedulingResponse> => {
		const response = await api.post<ExamSchedulingResponse>(
			"/exam-schedulings",
			data,
		);
		return response.data;
	},

	cancelScheduling: async (schedulingId: string): Promise<void> => {
		await api.delete(`/exam-schedulings/${schedulingId}`);
	},
};
