"use client";

import { useDaily } from "@daily-co/daily-react";
import { useEffect } from "react";
import { VideoControls } from "./VideoControls";
import { VideoTiles } from "./VideoTiles";

interface Props {
	onEnd: () => void;
}

export function VideoRoomInner({ onEnd }: Props) {
	const daily = useDaily();

	useEffect(() => {
		return () => {
			daily?.leave();
		};
	}, [daily]);

	return (
		<div className="flex flex-col rounded-xl overflow-hidden border border-border">
			<VideoTiles />
			<VideoControls onEnd={onEnd} />
		</div>
	);
}
