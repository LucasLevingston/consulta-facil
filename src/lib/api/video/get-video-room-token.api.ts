import { api } from "@/config/api";
import type { VideoRoom } from "@/lib/schemas/video/video-room.schema";

export async function getVideoRoomTokenApi(
	appointmentId: string,
): Promise<VideoRoom> {
	const response = await api.get<VideoRoom>(
		`/appointments/${appointmentId}/video-room/token`,
	);
	return response.data;
}
