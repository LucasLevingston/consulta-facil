import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { useAnamnesisChat } from "@/features/appointments/hooks/use-anamnesis-chat";

const mockApiPost = vi.mocked(api.post);

/** Cria uma Response simulada cujo body faz streaming dos chunks de texto informados. */
function createStreamingResponse(chunks: string[]) {
	const encoder = new TextEncoder();
	let index = 0;
	const read = vi.fn().mockImplementation(() => {
		if (index < chunks.length) {
			const value = encoder.encode(chunks[index]);
			index += 1;
			return Promise.resolve({ done: false, value });
		}
		return Promise.resolve({ done: true, value: undefined });
	});
	return {
		body: {
			getReader: () => ({ read }),
		},
	} as unknown as Response;
}

describe("useAnamnesisChat", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("inicia com a mensagem inicial de anamnese e loading/saving falsos", () => {
		const { result } = renderHook(() => useAnamnesisChat());

		expect(result.current.messages).toHaveLength(1);
		expect(result.current.messages[0].role).toBe("assistant");
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSaving).toBe(false);
	});

	it("não envia mensagem quando o texto é vazio ou apenas espaços", async () => {
		const { result } = renderHook(() => useAnamnesisChat());

		await act(async () => {
			await result.current.sendMessage("   ");
		});

		expect(result.current.messages).toHaveLength(1);
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("adiciona mensagem do usuário e acumula o streaming da resposta do assistente", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
			createStreamingResponse(["Olá", " tudo bem?"]),
		);

		const { result } = renderHook(() => useAnamnesisChat());

		await act(async () => {
			await result.current.sendMessage("Estou com dor de cabeça");
		});

		expect(result.current.messages).toHaveLength(3);
		expect(result.current.messages[1]).toMatchObject({
			role: "user",
			content: "Estou com dor de cabeça",
		});
		expect(result.current.messages[2]).toMatchObject({
			role: "assistant",
			content: "Olá tudo bem?",
		});
		expect(result.current.isLoading).toBe(false);
	});

	it("liga isLoading durante o envio e desliga ao final", async () => {
		let resolveFetch: (value: unknown) => void = () => {};
		(global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolveFetch = resolve;
				}),
		);

		const { result } = renderHook(() => useAnamnesisChat());

		let sendPromise: Promise<void>;
		act(() => {
			sendPromise = result.current.sendMessage("Oi");
		});

		expect(result.current.isLoading).toBe(true);

		await act(async () => {
			resolveFetch(createStreamingResponse(["ok"]));
			await sendPromise;
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("envia o token de autenticação no header quando presente no localStorage", async () => {
		localStorage.setItem("authToken", "token-123");
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
			createStreamingResponse(["ok"]),
		);

		const { result } = renderHook(() => useAnamnesisChat());

		await act(async () => {
			await result.current.sendMessage("Oi");
		});

		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining("/ai/anamnesis/chat"),
			expect.objectContaining({
				headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
			}),
		);
	});

	it("salva a anamnese extraída e chama onSave e onClose", async () => {
		const extracted = {
			appointmentId: "a-1",
			symptoms: "Dor de cabeça",
			startDate: "2026-01-01",
		};
		mockApiPost.mockResolvedValueOnce({ data: extracted } as never);
		const onSave = vi.fn().mockResolvedValue(undefined);
		const onClose = vi.fn();

		const { result } = renderHook(() => useAnamnesisChat());

		await act(async () => {
			await result.current.saveAnamnesis(onSave, onClose);
		});

		expect(mockApiPost).toHaveBeenCalledWith(
			"/ai/anamnesis/extract",
			expect.objectContaining({ messages: expect.any(Array) }),
		);
		expect(onSave).toHaveBeenCalledWith(extracted);
		expect(onClose).toHaveBeenCalled();
		expect(result.current.isSaving).toBe(false);
	});

	it("liga isSaving durante saveAnamnesis e desliga mesmo se onSave falhar", async () => {
		mockApiPost.mockResolvedValueOnce({ data: {} } as never);
		const onSave = vi.fn().mockRejectedValue(new Error("falhou"));
		const onClose = vi.fn();

		const { result } = renderHook(() => useAnamnesisChat());

		await act(async () => {
			await expect(
				result.current.saveAnamnesis(onSave, onClose),
			).rejects.toThrow("falhou");
		});

		await waitFor(() => expect(result.current.isSaving).toBe(false));
		expect(onClose).not.toHaveBeenCalled();
	});
});
