import { z } from "zod";

export const messageResponseSchema = z.object({
	id: z.string(),
	senderId: z.string(),
	senderName: z.string(),
	content: z.string(),
	sentAt: z.string(),
	isRead: z.boolean(),
});
export type MessageResponse = z.infer<typeof messageResponseSchema>;

export const conversationResponseSchema = z.object({
	id: z.string(),
	otherUserId: z.string(),
	otherUserName: z.string(),
	otherUserImageUrl: z.string().nullable(),
	lastMessage: messageResponseSchema.nullable(),
	unreadCount: z.number(),
});
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
