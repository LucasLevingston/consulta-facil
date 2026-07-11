import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useSearchParams: vi.fn(),
	useRouter: vi.fn(),
	usePathname: vi.fn(),
}));
vi.mock("@/components/auth/hooks", () => ({
	usePermission: vi.fn(),
}));
vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/components/patients/hooks", () => ({
	useProfessionalPatients: vi.fn(),
}));
vi.mock("./use-all-admin-patients", () => ({
	useAllAdminPatients: vi.fn(),
}));

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePermission } from "@/components/auth/hooks";
import { useProfessionalPatients } from "@/components/patients/hooks";
import { useUserStore } from "@/features/auth";
import { useAllAdminPatients } from "./use-all-admin-patients";
import { usePatientsPage } from "./use-patients-page";

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseRouter = vi.mocked(useRouter);
const mockUsePathname = vi.mocked(usePathname);
const mockUsePermission = vi.mocked(usePermission);
const mockUseUserStore = vi.mocked(useUserStore);
const mockUseAllAdminPatients = vi.mocked(useAllAdminPatients);
const mockUseProfessionalPatients = vi.mocked(useProfessionalPatients);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("usePatientsPage", () => {
	const push = vi.fn();

	beforeEach(() => {
		mockUseRouter.mockReturnValue({ push } as never);
		mockUsePathname.mockReturnValue("/patients");
		mockUseSearchParams.mockReturnValue(new URLSearchParams() as never);
		mockUseAllAdminPatients.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
		mockUseProfessionalPatients.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
	});

	it("usa useAllAdminPatients quando o papel é ADMIN", () => {
		mockUsePermission.mockReturnValue({ role: "ADMIN" } as never);
		mockUseUserStore.mockReturnValue({ user: { id: "u-1" } } as never);
		renderHook(() => usePatientsPage());
		expect(mockUseAllAdminPatients).toHaveBeenCalledWith({
			page: 0,
			size: 10,
			search: "",
			sort: "recent",
		});
	});

	it("usa useProfessionalPatients com o id do profissional quando o papel é PROFESSIONAL", () => {
		mockUsePermission.mockReturnValue({ role: "PROFESSIONAL" } as never);
		mockUseUserStore.mockReturnValue({ user: { id: "prof-1" } } as never);
		renderHook(() => usePatientsPage());
		expect(mockUseProfessionalPatients).toHaveBeenCalledWith(
			"prof-1",
			expect.objectContaining({ page: 0, size: 10 }),
		);
	});

	it("retorna patients, totalPages e totalElements a partir dos dados", () => {
		mockUsePermission.mockReturnValue({ role: "ADMIN" } as never);
		mockUseUserStore.mockReturnValue({ user: { id: "u-1" } } as never);
		mockUseAllAdminPatients.mockReturnValue({
			data: {
				content: [{ id: "p-1" }],
				totalPages: 3,
				totalElements: 25,
			},
			isLoading: false,
			error: null,
		} as never);
		const { result } = renderHook(() => usePatientsPage());
		expect(result.current.patients).toEqual([{ id: "p-1" }]);
		expect(result.current.totalPages).toBe(3);
		expect(result.current.totalElements).toBe(25);
	});

	it("updateParams navega com os novos parâmetros e reseta a página", () => {
		mockUsePermission.mockReturnValue({ role: "ADMIN" } as never);
		mockUseUserStore.mockReturnValue({ user: { id: "u-1" } } as never);
		mockUseSearchParams.mockReturnValue(new URLSearchParams("page=2") as never);
		const { result } = renderHook(() => usePatientsPage());
		act(() => result.current.updateParams({ q: "maria" }));
		expect(push).toHaveBeenCalledWith("/patients?q=maria", { scroll: false });
	});
});
