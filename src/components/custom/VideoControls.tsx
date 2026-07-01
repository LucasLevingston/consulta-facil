"use client";

import { useDaily } from "@daily-co/daily-react";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useCallback, useState } from "react";
import { CustomButton } from "@/components/custom/custom-button";

interface Props {
	onEnd: () => void;
}

export function VideoControls({ onEnd }: Props) {
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
