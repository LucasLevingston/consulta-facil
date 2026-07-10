"use client";

import { DailyProvider } from "@daily-co/daily-react";
import { useCallback } from "react";
import type { VideoRoomProps } from "./VideoRoom.types";
import { VideoRoomInner } from "./VideoRoomInner";

export function VideoRoom({ room, onEnd }: VideoRoomProps) {
	const handleEnd = useCallback(async () => {
		onEnd();
	}, [onEnd]);

	return (
		<DailyProvider url={room.roomUrl} token={room.token}>
			<VideoRoomInner onEnd={handleEnd} />
		</DailyProvider>
	);
}
