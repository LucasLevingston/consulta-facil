import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { reducer, toast, useToast } from "./use-toast";

describe("reducer (use-toast)", () => {
	it("ADD_TOAST adiciona um novo toast respeitando o TOAST_LIMIT (1)", () => {
		const state = { toasts: [] };
		// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
		const next = reducer(state, {
			type: "ADD_TOAST",
			toast: { id: "1", open: true } as any,
		});
		expect(next.toasts).toHaveLength(1);
		expect(next.toasts[0].id).toBe("1");

		const next2 = reducer(next, {
			type: "ADD_TOAST",
			// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
			toast: { id: "2", open: true } as any,
		});
		expect(next2.toasts).toHaveLength(1);
		expect(next2.toasts[0].id).toBe("2");
	});

	it("UPDATE_TOAST atualiza o toast correspondente pelo id", () => {
		// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
		const state = { toasts: [{ id: "1", open: true, title: "a" } as any] };
		const next = reducer(state, {
			type: "UPDATE_TOAST",
			toast: { id: "1", title: "b" },
		});
		expect(next.toasts[0].title).toBe("b");
	});

	it("DISMISS_TOAST com toastId marca apenas o toast correspondente como fechado", () => {
		const state = {
			toasts: [
				{ id: "1", open: true },
				{ id: "2", open: true },
				// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
			] as any,
		};
		const next = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });
		expect(next.toasts.find((t) => t.id === "1")?.open).toBe(false);
		expect(next.toasts.find((t) => t.id === "2")?.open).toBe(true);
	});

	it("DISMISS_TOAST sem toastId marca todos os toasts como fechados", () => {
		const state = {
			toasts: [
				{ id: "1", open: true },
				{ id: "2", open: true },
				// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
			] as any,
		};
		const next = reducer(state, { type: "DISMISS_TOAST", toastId: undefined });
		expect(next.toasts.every((t) => t.open === false)).toBe(true);
	});

	it("REMOVE_TOAST com toastId remove apenas o toast correspondente", () => {
		// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
		const state = { toasts: [{ id: "1" }, { id: "2" }] as any };
		const next = reducer(state, { type: "REMOVE_TOAST", toastId: "1" });
		expect(next.toasts.map((t) => t.id)).toEqual(["2"]);
	});

	it("REMOVE_TOAST sem toastId remove todos os toasts", () => {
		// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
		const state = { toasts: [{ id: "1" }, { id: "2" }] as any };
		const next = reducer(state, { type: "REMOVE_TOAST", toastId: undefined });
		expect(next.toasts).toEqual([]);
	});
});

describe("useToast / toast()", () => {
	it("toast() adiciona um toast visível ao estado retornado pelo hook", () => {
		const { result } = renderHook(() => useToast());
		act(() => {
			toast({ title: "Título de teste" });
		});
		expect(result.current.toasts).toHaveLength(1);
		expect(result.current.toasts[0].title).toBe("Título de teste");
		expect(result.current.toasts[0].open).toBe(true);
	});

	it("dismiss() retornado pelo hook marca o toast atual como fechado", () => {
		const { result } = renderHook(() => useToast());
		act(() => {
			toast({ title: "Outro toast" });
		});
		act(() => {
			result.current.dismiss();
		});
		expect(result.current.toasts[0].open).toBe(false);
	});
});
