import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConversationList } from "@/components/messaging/ConversationList";

const conversations = [
	{
		id: "c-1",
		otherUserId: "u-2",
		otherUserName: "Maria Souza",
		otherUserImageUrl: null,
		lastMessage: {
			id: "m-1",
			senderId: "u-2",
			senderName: "Maria",
			content: "Última mensagem",
			sentAt: new Date().toISOString(),
			isRead: false,
		},
		unreadCount: 3,
	},
	{
		id: "c-2",
		otherUserId: "u-3",
		otherUserName: "João Lima",
		otherUserImageUrl: null,
		lastMessage: null,
		unreadCount: 0,
	},
] as never;

describe("ConversationList", () => {
	it("exibe mensagem de lista vazia quando não há conversas", () => {
		render(
			<ConversationList
				conversations={[]}
				selectedId={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("Nenhuma conversa ainda.")).toBeInTheDocument();
	});

	it("renderiza uma entrada para cada conversa", () => {
		render(
			<ConversationList
				conversations={conversations}
				selectedId={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("Maria Souza")).toBeInTheDocument();
		expect(screen.getByText("João Lima")).toBeInTheDocument();
	});

	it("exibe a última mensagem quando existente e o texto padrão quando não há mensagens", () => {
		render(
			<ConversationList
				conversations={conversations}
				selectedId={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("Última mensagem")).toBeInTheDocument();
		expect(screen.getByText("Iniciar conversa")).toBeInTheDocument();
	});

	it("exibe o contador de mensagens não lidas quando maior que zero", () => {
		render(
			<ConversationList
				conversations={conversations}
				selectedId={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("chama onSelect com o id da conversa clicada", async () => {
		const onSelect = vi.fn();
		render(
			<ConversationList
				conversations={conversations}
				selectedId={null}
				onSelect={onSelect}
			/>,
		);
		await userEvent.click(screen.getByText("João Lima"));
		expect(onSelect).toHaveBeenCalledWith("c-2");
	});
});
