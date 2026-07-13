import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn() },
}));

import { api } from "@/config/api";
import { getVideoRoomTokenApi } from "./get-video-room-token.api";

const mockGet = vi.mocked(api.get);

const videoRoom = {
	roomUrl: "https://video.com/room/1",
	token: "token-abc",
	expiresAt: "2026-07-03T12:00:00Z",
};

describe("getVideoRoomTokenApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /appointments/:appointmentId/video-room/token e retorna o token da sala", async () => {
		mockGet.mockResolvedValueOnce({ data: videoRoom });

		const result = await getVideoRoomTokenApi("apt-1");

		expect(mockGet).toHaveBeenCalledWith(
			"/appointments/apt-1/video-room/token",
		);
		expect(result).toEqual(videoRoom);
	});

	it("propaga erro 404 quando a sala não existe", async () => {
		const error = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(getVideoRoomTokenApi("apt-inexistente")).rejects.toThrow(
			"Not Found",
		);
	});
});
