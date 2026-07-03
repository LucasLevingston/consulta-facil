import { api } from "@/config/api";
import type { VideoRoom } from "@/lib/schemas/video/video-room.schema";

export const videoRepository = {
	createRoom: async (appointmentId: string): Promise<VideoRoom> => {
		const res = await api.post<VideoRoom>(
			`/appointments/${appointmentId}/video-room`,
		);
		return res.data;
	},

	getToken: async (appointmentId: string): Promise<VideoRoom> => {
		const res = await api.get<VideoRoom>(
			`/appointments/${appointmentId}/video-room/token`,
		);
		return res.data;
	},
};
