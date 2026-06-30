import type { ConversationResponse } from "@/features/messaging";

export interface ConversationListProps {
	conversations: ConversationResponse[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}
