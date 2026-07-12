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
import { useSetModality } from "./use-set-modality";

const mockSetModality = vi.mocked(appointmentLifecycleApi.setModality);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSetModality", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls setModality with id and data", async () => {
		mockSetModality.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useSetModality(), {
			wrapper: wrapper(),
		});
		const data = { modality: "ONLINE" };
		await act(async () => {
			result.current.mutate({ id: "a-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSetModality).toHaveBeenCalledWith("a-1", data);
	});
});
