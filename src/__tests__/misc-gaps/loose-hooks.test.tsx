import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { useClinicFilterOptions } from "@/hooks/use-clinic-filter-options";
import { useIsMobile } from "@/hooks/use-mobile";
import { reducer, toast, useToast } from "@/hooks/use-toast";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
}));

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
			// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
			toasts: [
				{ id: "1", open: true },
				{ id: "2", open: true },
			] as any,
		};
		const next = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });
		expect(next.toasts.find((t) => t.id === "1")?.open).toBe(false);
		expect(next.toasts.find((t) => t.id === "2")?.open).toBe(true);
	});

	it("DISMISS_TOAST sem toastId marca todos os toasts como fechados", () => {
		const state = {
			// biome-ignore lint/suspicious/noExplicitAny: fixture mínima de ToasterToast em teste
			toasts: [
				{ id: "1", open: true },
				{ id: "2", open: true },
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

describe("useBreadcrumbs", () => {
	it("retorna os breadcrumbs mapeados explicitamente para uma rota conhecida", async () => {
		const { usePathname } = await import("next/navigation");
		vi.mocked(usePathname).mockReturnValue("/dashboard/employee");

		const { result } = renderHook(() => useBreadcrumbs());
		expect(result.current).toEqual([
			{ title: "Dashboard", link: "/dashboard" },
			{ title: "Employee", link: "/dashboard/employee" },
		]);
	});

	it("deriva os breadcrumbs a partir dos segmentos quando a rota não está mapeada", async () => {
		const { usePathname } = await import("next/navigation");
		vi.mocked(usePathname).mockReturnValue("/settings/profile");

		const { result } = renderHook(() => useBreadcrumbs());
		expect(result.current).toEqual([
			{ title: "Settings", link: "/settings" },
			{ title: "Profile", link: "/settings/profile" },
		]);
	});

	it("retorna array vazio para a rota raiz '/'", async () => {
		const { usePathname } = await import("next/navigation");
		vi.mocked(usePathname).mockReturnValue("/");

		const { result } = renderHook(() => useBreadcrumbs());
		expect(result.current).toEqual([]);
	});
});

describe("useClinicFilterOptions", () => {
	function makeClinic(overrides: Partial<ClinicResponse> = {}): ClinicResponse {
		return {
			id: "1",
			name: "Clínica Teste",
			status: "ACTIVE",
			ownerId: "owner-1",
			...overrides,
		};
	}

	it("retorna listas vazias e mantém radiusOptions quando não há clínicas", () => {
		const { result } = renderHook(() => useClinicFilterOptions([]));
		expect(result.current.availableStates).toEqual([]);
		expect(result.current.availableSpecialties).toEqual([]);
		expect(result.current.availableProfessions).toEqual([]);
		expect(result.current.radiusOptions).toBe(RADIUS_OPTIONS);
	});

	it("extrai estados, especialidades e profissões únicos e ordenados a partir das clínicas", () => {
		const clinics: ClinicResponse[] = [
			makeClinic({
				id: "1",
				state: "SP",
				members: [
					{
						professionalProfileId: "p1",
						specialty: "Cardiologia",
						role: "DOCTOR",
					},
				],
			}),
			makeClinic({
				id: "2",
				state: "RJ",
				members: [
					{
						professionalProfileId: "p2",
						specialty: "Cardiologia",
						role: "NURSE",
					},
				],
			}),
			makeClinic({ id: "3", state: "SP", members: [] }),
			makeClinic({ id: "4", state: null }),
		];

		const { result } = renderHook(() => useClinicFilterOptions(clinics));
		expect(result.current.availableStates).toEqual(["RJ", "SP"]);
		expect(result.current.availableSpecialties).toEqual(["Cardiologia"]);
		expect(result.current.availableProfessions).toEqual(["DOCTOR", "NURSE"]);
	});
});
