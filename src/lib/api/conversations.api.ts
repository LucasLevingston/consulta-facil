import { api } from "@/config/api";
import type { ConversationResponse } from "@/lib/schemas/messaging/message.schema";
import type { MessagesPage } from "./conversations.api.types";

export type { MessagesPage } from "./conversations.api.types";

export const conversationsApi = {
	list: async (): Promise<ConversationResponse[]> => {
		const res = await api.get<ConversationResponse[]>("/conversations");
		return res.data;
	},

	getOrCreate: async (
		professionalId: string,
	): Promise<ConversationResponse> => {
		const res = await api.post<ConversationResponse>(
			`/conversations/${professionalId}`,
		);
		return res.data;
	},

	getHistory: async (id: string, page = 0): Promise<MessagesPage> => {
		const res = await api.get<MessagesPage>(`/conversations/${id}/messages`, {
			params: { page, size: 30, sort: "sentAt,desc" },
		});
		return res.data;
	},

	markAsRead: async (id: string): Promise<void> => {
		await api.post(`/conversations/${id}/read`);
	},
};
