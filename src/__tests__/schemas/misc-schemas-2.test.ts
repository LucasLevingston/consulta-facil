import { describe, expect, it } from "vitest";
import { videoRoomSchema } from "@/lib/schemas/video/video-room.schema";

describe("videoRoomSchema", () => {
	it("accepts valid data", () => {
		const result = videoRoomSchema.safeParse({
			roomUrl: "https://video.example.com/room/123",
			token: "abc123token",
			expiresAt: "2024-12-31T23:59:59Z",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid roomUrl (not a URL)", () => {
		expect(
			videoRoomSchema.safeParse({
				roomUrl: "not-a-url",
				token: "abc123",
				expiresAt: "2024-12-31T23:59:59Z",
			}).success,
		).toBe(false);
	});
	it("rejects missing token", () => {
		expect(
			videoRoomSchema.safeParse({
				roomUrl: "https://video.example.com/room",
				expiresAt: "2024-12-31",
			}).success,
		).toBe(false);
	});
	it("rejects missing fields", () => {
		expect(videoRoomSchema.safeParse({}).success).toBe(false);
	});
});
