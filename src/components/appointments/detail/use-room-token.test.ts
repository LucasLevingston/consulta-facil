import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/video/repositories/video.repository", () => ({
	videoRepository: {
		createRoom: vi.fn(),
		getToken: vi.fn(),
	},
}));

import { videoRepository } from "@/features/video/repositories/video.repository";
import { useRoomToken } from "./use-room-token";

const mockGetToken = vi.mocked(videoRepository.getToken);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRoomToken", () => {
	beforeEach(() => vi.clearAllMocks());

	it("desabilitado quando appointmentId e null", () => {
		const { result } = renderHook(() => useRoomToken(null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca o token da sala quando appointmentId informado", async () => {
		const room = { roomId: "room-1", token: "tok-123" };
		mockGetToken.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useRoomToken("appt-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetToken).toHaveBeenCalledWith("appt-1");
		expect(result.current.data).toEqual(room);
	});
});
