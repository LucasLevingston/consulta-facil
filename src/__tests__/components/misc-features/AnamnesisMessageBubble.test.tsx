import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnamnesisMessageBubble } from "@/components/anamnesis/AnamnesisMessageBubble";

describe("AnamnesisMessageBubble", () => {
	it("renderiza o conteúdo da mensagem do assistente", () => {
		render(
			<AnamnesisMessageBubble
				msg={{
					id: "m-1",
					role: "assistant",
					content: "Olá! Como posso ajudar?",
				}}
				isLoading={false}
				isLast={false}
			/>,
		);
		expect(screen.getByText("Olá! Como posso ajudar?")).toBeInTheDocument();
	});

	it("renderiza o conteúdo da mensagem do usuário", () => {
		render(
			<AnamnesisMessageBubble
				msg={{ id: "m-2", role: "user", content: "Estou com febre." }}
				isLoading={false}
				isLast={false}
			/>,
		);
		expect(screen.getByText("Estou com febre.")).toBeInTheDocument();
	});

	it("exibe indicador de digitação quando é a última mensagem do assistente vazia e está carregando", () => {
		const { container } = render(
			<AnamnesisMessageBubble
				msg={{ id: "m-3", role: "assistant", content: "" }}
				isLoading={true}
				isLast={true}
			/>,
		);
		expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
	});

	it("não exibe indicador de digitação quando a mensagem do assistente já tem conteúdo", () => {
		const { container } = render(
			<AnamnesisMessageBubble
				msg={{ id: "m-4", role: "assistant", content: "Resposta pronta" }}
				isLoading={true}
				isLast={true}
			/>,
		);
		expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
	});
});
