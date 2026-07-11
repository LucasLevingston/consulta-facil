import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGoogleGIS } from "./use-google-gis";

const SCRIPT_ID = "google-gis-script";

function removeExistingScript() {
	const existing = document.getElementById(SCRIPT_ID);
	existing?.remove();
}

beforeEach(() => {
	removeExistingScript();
	window.google = undefined as unknown as Window["google"];
});

afterEach(() => {
	removeExistingScript();
	vi.restoreAllMocks();
});

describe("useGoogleGIS", () => {
	it("isAvailable é falso quando clientId não é informado", () => {
		const onCredential = vi.fn();
		const { result } = renderHook(() => useGoogleGIS(undefined, onCredential));
		expect(result.current.isAvailable).toBe(false);
		expect(document.getElementById(SCRIPT_ID)).toBeNull();
	});

	it("signIn não lança erro quando window.google ainda não está disponível", () => {
		const onCredential = vi.fn();
		const { result } = renderHook(() => useGoogleGIS(undefined, onCredential));
		expect(() => result.current.signIn()).not.toThrow();
	});

	it("isAvailable é verdadeiro e cria a tag de script quando clientId é informado", () => {
		const onCredential = vi.fn();
		const { result } = renderHook(() =>
			useGoogleGIS("client-123", onCredential),
		);

		expect(result.current.isAvailable).toBe(true);
		const script = document.getElementById(
			SCRIPT_ID,
		) as HTMLScriptElement | null;
		expect(script).not.toBeNull();
		expect(script?.src).toBe("https://accounts.google.com/gsi/client");
		expect(script?.async).toBe(true);
		expect(script?.defer).toBe(true);
	});

	it("inicializa o Google Identity Services e propaga o credential ao carregar o script", () => {
		const initialize = vi.fn();
		window.google = {
			accounts: {
				id: {
					initialize,
					prompt: vi.fn(),
					renderButton: vi.fn(),
				},
			},
		};
		const onCredential = vi.fn();
		renderHook(() => useGoogleGIS("client-123", onCredential));

		const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;
		expect(script.onload).toBeInstanceOf(Function);

		// simula o carregamento do script
		script.onload?.(new Event("load"));

		expect(initialize).toHaveBeenCalledWith(
			expect.objectContaining({ client_id: "client-123", auto_select: false }),
		);

		// simula o Google chamando o callback configurado com o credential do usuário
		const config = initialize.mock.calls[0][0] as {
			callback: (res: { credential: string }) => void;
		};
		config.callback({ credential: "token-abc" });
		expect(onCredential).toHaveBeenCalledWith("token-abc");
	});

	it("reaproveita o script já existente e inicializa imediatamente sem recriar a tag", () => {
		const initialize = vi.fn();
		window.google = {
			accounts: {
				id: {
					initialize,
					prompt: vi.fn(),
					renderButton: vi.fn(),
				},
			},
		};
		const existingScript = document.createElement("script");
		existingScript.id = SCRIPT_ID;
		document.head.appendChild(existingScript);

		const onCredential = vi.fn();
		renderHook(() => useGoogleGIS("client-456", onCredential));

		// initGoogle é chamado de imediato pois o script já existe no documento
		expect(initialize).toHaveBeenCalledWith(
			expect.objectContaining({ client_id: "client-456", auto_select: false }),
		);
		expect(document.querySelectorAll(`#${SCRIPT_ID}`)).toHaveLength(1);
	});

	it("signIn chama window.google.accounts.id.prompt", () => {
		const prompt = vi.fn();
		window.google = {
			accounts: {
				id: {
					initialize: vi.fn(),
					prompt,
					renderButton: vi.fn(),
				},
			},
		};
		const onCredential = vi.fn();
		const { result } = renderHook(() =>
			useGoogleGIS("client-123", onCredential),
		);
		result.current.signIn();
		expect(prompt).toHaveBeenCalledTimes(1);
	});
});
