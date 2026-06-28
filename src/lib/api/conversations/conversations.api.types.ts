import type { MessageResponse } from "@/lib/schemas/messaging/message.schema";

export interface MessagesPage {
	content: MessageResponse[];
	totalPages: number;
	totalElements: number;
	number: number;
}
