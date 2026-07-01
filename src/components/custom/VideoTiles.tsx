"use client";

import { useLocalSessionId, useParticipantIds } from "@daily-co/daily-react";

export function VideoTiles() {
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
