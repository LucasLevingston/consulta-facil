import type { VideoRoom as VideoRoomData } from "@/features/video";

export interface VideoRoomProps {
	room: VideoRoomData;
	onEnd: () => void;
	isProfessional?: boolean;
}
