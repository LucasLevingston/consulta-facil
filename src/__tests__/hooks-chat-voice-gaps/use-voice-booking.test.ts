import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { useVoiceBooking } from "@/hooks/use-voice-booking";

const mockApiPost = vi.mocked(api.post);

/** Simula a classe SpeechRecognition do browser, expondo os handlers atribuídos pelo hook. */
class MockSpeechRecognition {
	lang = "";
	interimResults = false;
	maxAlternatives = 1;
	onresult: ((event: unknown) => void) | null = null;
	onerror: ((event: { error: string }) => void) | null = null;
	onend: (() => void) | null = null;
	start = vi.fn();
	stop = vi.fn();
}

let lastInstance: MockSpeechRecognition | null = null;

function setSpeechRecognitionInstalled(installed: boolean) {
	if (installed) {
		lastInstance = null;
		(window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = vi
			.fn()
			.mockImplementation(function MockSpeechRecognitionCtor() {
				lastInstance = new MockSpeechRecognition();
				return lastInstance;
			});
		return;
	}
	delete (window as unknown as { SpeechRecognition?: unknown })
		.SpeechRecognition;
	delete (window as unknown as { webkitSpeechRecognition?: unknown })
		.webkitSpeechRecognition;
}

const voiceResult = {
	specialty: "Cardiologia",
	professionalName: null,
	date: "2026-07-10",
	timePreference: "morning" as const,
	modality: "IN_PERSON" as const,
	reason: "Consulta de rotina",
	confidence: "high" as const,
	summary: "Agendar consulta de cardiologia pela manhã",
};

describe("useVoiceBooking", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setSpeechRecognitionInstalled(false);
	});

	afterEach(() => {
		setSpeechRecognitionInstalled(false);
	});

	it("indica que o navegador não é suportado quando SpeechRecognition não existe", () => {
		const { result } = renderHook(() => useVoiceBooking());
		expect(result.current.isSupported).toBe(false);
	});

	it("seta status de erro ao chamar start sem suporte do navegador", async () => {
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe(
			"Seu navegador não suporta entrada de voz.",
		);
	});

	it("indica suporte quando SpeechRecognition está disponível e inicia a escuta", async () => {
		setSpeechRecognitionInstalled(true);
		const { result } = renderHook(() => useVoiceBooking());

		expect(result.current.isSupported).toBe(true);

		await act(async () => {
			await result.current.start();
		});

		expect(result.current.status).toBe("listening");
		expect(lastInstance?.start).toHaveBeenCalledTimes(1);
	});

	it("processa o resultado da fala e obtém o agendamento por voz com sucesso", async () => {
		setSpeechRecognitionInstalled(true);
		mockApiPost.mockResolvedValueOnce({ data: voiceResult } as never);
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});

		await act(async () => {
			await lastInstance?.onresult?.({
				results: [[{ transcript: "Quero marcar uma consulta de cardiologia" }]],
			});
		});

		expect(mockApiPost).toHaveBeenCalledWith("/ai/voice-booking", {
			transcript: "Quero marcar uma consulta de cardiologia",
		});
		expect(result.current.transcript).toBe(
			"Quero marcar uma consulta de cardiologia",
		);
		expect(result.current.result).toEqual(voiceResult);
		expect(result.current.status).toBe("done");
	});

	it("seta status de erro quando a API de agendamento por voz falha", async () => {
		setSpeechRecognitionInstalled(true);
		mockApiPost.mockRejectedValueOnce(new Error("Falha na rede"));
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});

		await act(async () => {
			await lastInstance?.onresult?.({
				results: [[{ transcript: "Marcar consulta" }]],
			});
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Falha na rede");
	});

	it("seta status de erro quando o reconhecimento de voz dispara onerror", async () => {
		setSpeechRecognitionInstalled(true);
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});

		act(() => {
			lastInstance?.onerror?.({ error: "network" });
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Erro de reconhecimento: network");
	});

	it("stop interrompe o reconhecimento e volta o status para idle", async () => {
		setSpeechRecognitionInstalled(true);
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});

		act(() => {
			result.current.stop();
		});

		expect(lastInstance?.stop).toHaveBeenCalledTimes(1);
		expect(result.current.status).toBe("idle");
	});

	it("reset limpa transcript, resultado, erro e volta o status para idle", async () => {
		setSpeechRecognitionInstalled(true);
		mockApiPost.mockResolvedValueOnce({ data: voiceResult } as never);
		const { result } = renderHook(() => useVoiceBooking());

		await act(async () => {
			await result.current.start();
		});
		await act(async () => {
			await lastInstance?.onresult?.({
				results: [[{ transcript: "Marcar consulta" }]],
			});
		});

		act(() => {
			result.current.reset();
		});

		expect(result.current.status).toBe("idle");
		expect(result.current.transcript).toBe("");
		expect(result.current.result).toBeNull();
		expect(result.current.error).toBeNull();
	});
});
