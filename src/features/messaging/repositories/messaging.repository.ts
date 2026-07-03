import { conversationsApi } from "@/lib/api/conversations/conversations.api";
import type { MessagesPage } from "@/lib/api/conversations/conversations.api.types";
import type { ConversationResponse } from "@/lib/schemas/messaging/message.schema";

export const messagingRepository = {
	list: async (): Promise<ConversationResponse[]> => conversationsApi.list(),

	getOrCreate: async (professionalId: string): Promise<ConversationResponse> =>
		conversationsApi.getOrCreate(professionalId),

	getHistory: async (id: string, page = 0): Promise<MessagesPage> =>
		conversationsApi.getHistory(id, page),

	markAsRead: async (id: string): Promise<void> =>
		conversationsApi.markAsRead(id),
};
