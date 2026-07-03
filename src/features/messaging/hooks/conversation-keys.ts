export const conversationKeys = {
	all: ["conversations"] as const,
	history: (id: string) => ["conversations", id, "messages"] as const,
};
