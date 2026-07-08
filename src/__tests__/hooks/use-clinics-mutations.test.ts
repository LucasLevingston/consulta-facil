import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
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
vi.mock("@/lib/api/clinics/clinic-staff.api", () => ({
	clinicStaffApi: {
		inviteReceptionist: vi.fn(),
		removeReceptionist: vi.fn(),
		getReceptionists: vi.fn(),
	},
}));
vi.mock("@/lib/api/clinics/clinic-queue.api", () => ({
	clinicQueueApi: {
		getQueue: vi.fn(),
	},
}));

import { useClinicQueue } from "@/features/clinics/hooks/use-clinic-queue";
import { clinicQueueApi } from "@/lib/api/clinics/clinic-queue.api";

const mockGetQueue = vi.mocked(clinicQueueApi.getQueue);

const queueItem = { id: "a-1", status: "WAITING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinicQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when clinicId empty", () => {
		const { result } = renderHook(() => useClinicQueue(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when clinicId provided", async () => {
		mockGetQueue.mockResolvedValueOnce([queueItem] as never);
		const { result } = renderHook(() => useClinicQueue("c-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
