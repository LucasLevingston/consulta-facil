import { api } from "@/config/api";
import type { VideoRoom } from "@/lib/schemas/video/video-room.schema";

export async function createVideoRoomApi(
	appointmentId: string,
): Promise<VideoRoom> {
	const response = await api.post<VideoRoom>(
		`/appointments/${appointmentId}/video-room`,
	);
	return response.data;
}
