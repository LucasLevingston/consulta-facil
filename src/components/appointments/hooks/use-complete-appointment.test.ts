import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-lifecycle.api", () => ({
	appointmentLifecycleApi: {
		cancel: vi.fn(),
		confirm: vi.fn(),
		complete: vi.fn(),
		setModality: vi.fn(),
	},
}));

import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import { useCompleteAppointment } from "./use-complete-appointment";

const mockComplete = vi.mocked(appointmentLifecycleApi.complete);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCompleteAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls complete with id", async () => {
		mockComplete.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCompleteAppointment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockComplete).toHaveBeenCalledWith("a-1");
	});
});
