"use client";

import { useCallback, useRef, useState } from "react";
import { api } from "@/config/api";
import type { VoiceBookingResult } from "@/lib/types/ai";

type Status = "idle" | "listening" | "processing" | "done" | "error";

export function useVoiceBooking() {
	const [status, setStatus] = useState<Status>("idle");
	const [transcript, setTranscript] = useState("");
	const [result, setResult] = useState<VoiceBookingResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	const isSupported =
		typeof window !== "undefined" &&
		("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

	const start = useCallback(async () => {
		if (!isSupported) {
			setError("Seu navegador não suporta entrada de voz.");
			setStatus("error");
			return;
		}

		setError(null);
		setResult(null);
		setTranscript("");
		setStatus("listening");

		const SpeechRecognition =
			window.SpeechRecognition ?? window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.lang = "pt-BR";
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		recognitionRef.current = recognition;

		recognition.onresult = async (event) => {
			const text = event.results[0]?.[0]?.transcript ?? "";
			setTranscript(text);
			setStatus("processing");

			try {
				const { data } = await api.post<VoiceBookingResult>(
					"/ai/voice-booking",
					{
						transcript: text,
					},
				);
				setResult(data);
				setStatus("done");
			} catch (e) {
				setError(e instanceof Error ? e.message : "Erro ao processar voz.");
				setStatus("error");
			}
		};

		recognition.onerror = (event) => {
			setError(`Erro de reconhecimento: ${event.error}`);
			setStatus("error");
		};

		recognition.onend = () => {
			if (status === "listening") setStatus("idle");
		};

		recognition.start();
	}, [isSupported, status]);

	const stop = useCallback(() => {
		recognitionRef.current?.stop();
		setStatus("idle");
	}, []);

	const reset = useCallback(() => {
		recognitionRef.current?.stop();
		setStatus("idle");
		setTranscript("");
		setResult(null);
		setError(null);
	}, []);

	return { status, transcript, result, error, isSupported, start, stop, reset };
}
