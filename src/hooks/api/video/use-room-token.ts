"use client";

import { useQuery } from "@tanstack/react-query";
import { getVideoRoomTokenApi } from "@/lib/api/video/get-video-room-token.api";

export function useRoomToken(appointmentId: string | null) {
	return useQuery({
		queryKey: ["video-room", appointmentId],
		queryFn: () => getVideoRoomTokenApi(appointmentId ?? ""),
		enabled: !!appointmentId,
		staleTime: 5 * 60 * 1000,
	});
}
