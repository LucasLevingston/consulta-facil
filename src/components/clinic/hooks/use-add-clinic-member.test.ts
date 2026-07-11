import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics/clinics.api", () => ({
	clinicsCrudApi: {
		getAll: vi.fn(),
		getMy: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		addMember: vi.fn(),
		removeMember: vi.fn(),
	},
}));

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { useAddClinicMember } from "./use-add-clinic-member";

const mockAddMember = vi.mocked(clinicsCrudApi.addMember);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAddClinicMember", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls addMember with clinicId and professionalProfileId", async () => {
		mockAddMember.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAddClinicMember(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ clinicId: "c-1", professionalProfileId: "p-1" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddMember).toHaveBeenCalledWith("c-1", "p-1");
	});
});
