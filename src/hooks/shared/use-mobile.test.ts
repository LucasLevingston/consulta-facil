import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
	function setupMatchMedia(width: number) {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: width,
		});
		const listeners: Array<() => void> = [];
		// biome-ignore lint/suspicious/noExplicitAny: mock simplificado de MediaQueryList
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: width < 768,
			media: query,
			addEventListener: (_event: string, cb: () => void) => {
				listeners.push(cb);
			},
			removeEventListener: vi.fn(),
			// biome-ignore lint/suspicious/noExplicitAny: mock simplificado de MediaQueryList
		})) as any;
		return listeners;
	}

	it("retorna true quando a largura da janela é menor que o breakpoint mobile (768px)", () => {
		setupMatchMedia(500);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it("retorna false quando a largura da janela é maior ou igual ao breakpoint mobile", () => {
		setupMatchMedia(1024);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("atualiza o valor quando o evento 'change' do matchMedia dispara", () => {
		const listeners = setupMatchMedia(1024);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 375,
		});
		act(() => {
			for (const cb of listeners) cb();
		});
		expect(result.current).toBe(true);
	});
});
