import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBreadcrumbs } from "./use-breadcrumbs";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
}));

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
