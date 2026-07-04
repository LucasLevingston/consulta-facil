import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments", () => ({
	useAnamnesisChat: vi.fn(),
}));

import { AnamnesisAIChat } from "@/components/anamnesis/AnamnesisAIChat";
import { useAnamnesisChat } from "@/features/appointments";

const mockUseAnamnesisChat = vi.mocked(useAnamnesisChat);

function setup(overrides: Partial<ReturnType<typeof useAnamnesisChat>> = {}) {
	const state = {
		messages: [
			{ id: "m-1", role: "assistant" as const, content: "Olá, tudo bem?" },
		],
		isLoading: false,
		isSaving: false,
		sendMessage: vi.fn().mockResolvedValue(undefined),
		saveAnamnesis: vi.fn().mockResolvedValue(undefined),
		...overrides,
	};
	mockUseAnamnesisChat.mockReturnValue(state as never);
	return state;
}

describe("AnamnesisAIChat", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Element.prototype.scrollIntoView = vi.fn();
	});

	it("renderiza as mensagens do histórico do chat", () => {
		setup();
		render(<AnamnesisAIChat onSave={vi.fn()} onClose={vi.fn()} />);
		expect(screen.getByText("Olá, tudo bem?")).toBeInTheDocument();
	});

	it("envia a mensagem digitada ao clicar no botão de enviar", async () => {
		const state = setup();
		render(<AnamnesisAIChat onSave={vi.fn()} onClose={vi.fn()} />);

		const textarea = screen.getByPlaceholderText("Digite sua resposta...");
		await userEvent.type(textarea, "Estou com dor de cabeça");
		const sendButton = textarea.parentElement?.querySelector("button");
		await userEvent.click(sendButton as HTMLButtonElement);

		expect(state.sendMessage).toHaveBeenCalledWith("Estou com dor de cabeça");
	});

	it("desabilita o botão de enviar quando o campo está vazio", () => {
		setup();
		render(<AnamnesisAIChat onSave={vi.fn()} onClose={vi.fn()} />);
		const textarea = screen.getByPlaceholderText("Digite sua resposta...");
		const sendButton = textarea.parentElement?.querySelector("button");
		expect(sendButton).toBeDisabled();
	});

	it("desabilita o botão de salvar quando há menos de 3 mensagens", () => {
		setup({
			messages: [{ id: "m-1", role: "assistant" as const, content: "Olá" }],
		});
		render(<AnamnesisAIChat onSave={vi.fn()} onClose={vi.fn()} />);
		expect(screen.getByText("Salvar na anamnese")).toBeDisabled();
	});

	it("chama saveAnamnesis com onSave e onClose ao clicar em Salvar na anamnese", async () => {
		const onSave = vi.fn();
		const onClose = vi.fn();
		const state = setup({
			messages: [
				{ id: "m-1", role: "assistant" as const, content: "Olá" },
				{ id: "m-2", role: "user" as const, content: "Dor de cabeça" },
				{
					id: "m-3",
					role: "assistant" as const,
					content: "Entendi, mais algo?",
				},
			],
		});
		render(<AnamnesisAIChat onSave={onSave} onClose={onClose} />);
		await userEvent.click(screen.getByText("Salvar na anamnese"));
		expect(state.saveAnamnesis).toHaveBeenCalledWith(onSave, onClose);
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		setup();
		render(<AnamnesisAIChat onSave={vi.fn()} onClose={onClose} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalled();
	});
});
