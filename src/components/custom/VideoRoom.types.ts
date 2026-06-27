import type { VideoRoom as VideoRoomData } from "@/lib/schemas/video/video-room.schema";

export interface VideoRoomProps {
	room: VideoRoomData;
	onEnd: () => void;
	isProfessional?: boolean;
}
