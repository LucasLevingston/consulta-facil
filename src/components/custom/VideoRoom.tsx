"use client";

import {
	DailyProvider,
	useDaily,
	useLocalSessionId,
	useParticipantIds,
} from "@daily-co/daily-react";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CustomButton } from "@/components/custom/custom-button";
import type { VideoRoomProps } from "./VideoRoom.types";

function VideoControls({ onEnd }: { onEnd: () => void }) {
	const daily = useDaily();
	const [micMuted, setMicMuted] = useState(false);
	const [camOff, setCamOff] = useState(false);

	const toggleMic = useCallback(() => {
		daily?.setLocalAudio(micMuted);
		setMicMuted((v) => !v);
	}, [daily, micMuted]);

	const toggleCam = useCallback(() => {
		daily?.setLocalVideo(camOff);
		setCamOff((v) => !v);
	}, [daily, camOff]);

	return (
		<div className="flex items-center justify-center gap-3 p-4 bg-background border-t border-border">
			<CustomButton
				variant="outline"
				size="sm"
				onClick={toggleMic}
				className="gap-2"
			>
				{micMuted ? (
					<MicOff className="h-4 w-4 text-destructive" />
				) : (
					<Mic className="h-4 w-4" />
				)}
				{micMuted ? "Ativar mic" : "Silenciar"}
			</CustomButton>

			<CustomButton
				variant="outline"
				size="sm"
				onClick={toggleCam}
				className="gap-2"
			>
				{camOff ? (
					<VideoOff className="h-4 w-4 text-destructive" />
				) : (
					<Video className="h-4 w-4" />
				)}
				{camOff ? "Ligar câmera" : "Desligar câmera"}
			</CustomButton>

			<CustomButton
				variant="destructive"
				size="sm"
				onClick={onEnd}
				className="gap-2"
			>
				<Phone className="h-4 w-4 rotate-[135deg]" />
				Encerrar consulta
			</CustomButton>
		</div>
	);
}

function VideoTiles() {
	const localId = useLocalSessionId();
	const remoteIds = useParticipantIds({ filter: "remote" });

	return (
		<div className="flex-1 grid gap-2 p-2 bg-black min-h-[320px]">
			{remoteIds.length === 0 && (
				<div className="flex items-center justify-center text-white/60 text-sm">
					Aguardando o outro participante entrar...
				</div>
			)}
			{[localId, ...remoteIds].filter(Boolean).map((id) => (
				<div
					key={id}
					className="relative rounded-lg overflow-hidden bg-zinc-900 aspect-video"
				>
					<video
						autoPlay
						playsInline
						muted={id === localId}
						className="w-full h-full object-cover"
						ref={(el) => {
							if (!el || !id) return;
						}}
					/>
					{id === localId && (
						<span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
							Você
						</span>
					)}
				</div>
			))}
		</div>
	);
}

function VideoRoomInner({ onEnd }: { onEnd: () => void }) {
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

export function VideoRoom({ room, onEnd, isProfessional }: VideoRoomProps) {
	const handleEnd = useCallback(async () => {
		onEnd();
	}, [onEnd]);

	return (
		<DailyProvider url={room.roomUrl} token={room.token}>
			<VideoRoomInner onEnd={handleEnd} />
		</DailyProvider>
	);
}
