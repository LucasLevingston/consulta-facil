"use client";

import { useQuery } from "@tanstack/react-query";
import { videoRepository } from "../repositories/video.repository";

export function useRoomToken(appointmentId: string | null) {
	return useQuery({
		queryKey: ["video-room", appointmentId],
		queryFn: () => videoRepository.getToken(appointmentId!),
		enabled: !!appointmentId,
		staleTime: 5 * 60 * 1000,
	});
}
