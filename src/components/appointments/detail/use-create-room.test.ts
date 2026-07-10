import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/video/repositories/video.repository", () => ({
	videoRepository: {
		createRoom: vi.fn(),
		getToken: vi.fn(),
	},
}));

import { videoRepository } from "@/features/video/repositories/video.repository";
import { useCreateRoom } from "./use-create-room";

const mockCreateRoom = vi.mocked(videoRepository.createRoom);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useCreateRoom", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cria uma sala de video e invalida a query do appointment", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const room = { roomId: "room-1", url: "https://video.example.com/room-1" };
		mockCreateRoom.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useCreateRoom(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync("appt-1");
		});
		expect(mockCreateRoom).toHaveBeenCalledWith("appt-1");
		expect(invalidateSpy).toHaveBeenCalled();
	});
});
