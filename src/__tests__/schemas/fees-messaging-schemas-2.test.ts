import { describe, expect, it } from "vitest";
import {
	conversationResponseSchema,
	messageResponseSchema,
} from "@/lib/schemas/messaging/message.schema";

describe("messageResponseSchema", () => {
	it("accepts valid data", () => {
		const result = messageResponseSchema.safeParse({
			id: "1",
			senderId: "s1",
			senderName: "Alice",
			content: "Hello",
			sentAt: "2024-01-01T00:00:00Z",
			isRead: false,
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(messageResponseSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for isRead", () => {
		expect(
			messageResponseSchema.safeParse({
				id: "1",
				senderId: "s1",
				senderName: "Alice",
				content: "Hi",
				sentAt: "2024-01-01T00:00:00Z",
				isRead: "yes",
			}).success,
		).toBe(false);
	});
});

describe("conversationResponseSchema", () => {
	it("accepts valid data with null lastMessage", () => {
		const result = conversationResponseSchema.safeParse({
			id: "1",
			otherUserId: "u2",
			otherUserName: "Bob",
			otherUserImageUrl: null,
			lastMessage: null,
			unreadCount: 0,
		});
		expect(result.success).toBe(true);
	});
	it("accepts valid data with nested lastMessage", () => {
		const msg = {
			id: "m1",
			senderId: "s1",
			senderName: "Alice",
			content: "Hi",
			sentAt: "2024-01-01T00:00:00Z",
			isRead: false,
		};
		const result = conversationResponseSchema.safeParse({
			id: "1",
			otherUserId: "u2",
			otherUserName: "Bob",
			otherUserImageUrl: null,
			lastMessage: msg,
			unreadCount: 2,
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(conversationResponseSchema.safeParse({}).success).toBe(false);
	});
});
