import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-video.api", () => ({
	appointmentVideoApi: { generateMeetLink: vi.fn() },
}));

import { appointmentVideoApi } from "@/lib/api/appointments/appointment-video.api";
import { useGenerateMeetLink } from "./use-generate-meet-link";

const mockGenerateMeetLink = vi.mocked(appointmentVideoApi.generateMeetLink);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useGenerateMeetLink", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls generateMeetLink with id", async () => {
		mockGenerateMeetLink.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useGenerateMeetLink(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGenerateMeetLink).toHaveBeenCalledWith("a-1");
	});
});
