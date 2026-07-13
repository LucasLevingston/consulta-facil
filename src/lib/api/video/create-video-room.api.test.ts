import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { post: vi.fn() },
}));

import { api } from "@/config/api";
import { createVideoRoomApi } from "./create-video-room.api";

const mockPost = vi.mocked(api.post);

const videoRoom = {
	roomUrl: "https://video.com/room/1",
	token: "token-abc",
	expiresAt: "2026-07-03T12:00:00Z",
};

describe("createVideoRoomApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /appointments/:appointmentId/video-room e retorna a sala criada", async () => {
		mockPost.mockResolvedValueOnce({ data: videoRoom });

		const result = await createVideoRoomApi("apt-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/apt-1/video-room");
		expect(result).toEqual(videoRoom);
	});

	it("propaga erro 409 quando a sala já existe", async () => {
		const error = Object.assign(new Error("Conflict"), {
			response: { status: 409 },
		});
		mockPost.mockRejectedValueOnce(error);

		await expect(createVideoRoomApi("apt-1")).rejects.toThrow("Conflict");
	});
});
