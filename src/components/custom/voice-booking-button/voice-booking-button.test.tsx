import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks dos hooks usados internamente por VoiceBookingButton
const mockUseVoiceBooking = vi.hoisted(() => vi.fn());
vi.mock("./use-voice-booking", () => ({
	useVoiceBooking: mockUseVoiceBooking,
}));
vi.mock("./voice-booking-result", () => ({
	VoiceBookingResultCard: ({
		result,
		onReset,
		onUse,
	}: {
		result: { summary: string };
		onReset: () => void;
		onUse: () => void;
	}) => (
		<div>
			<span>{result.summary}</span>
			<button type="button" onClick={onReset}>
				resetar
			</button>
			<button type="button" onClick={onUse}>
				usar
			</button>
		</div>
	),
}));

import { VoiceBookingButton } from "./voice-booking-button";

describe("VoiceBookingButton", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("não renderiza nada quando o navegador não suporta reconhecimento de voz", () => {
		mockUseVoiceBooking.mockReturnValue({
			status: "idle",
			transcript: "",
			result: null,
			error: null,
			isSupported: false,
			start: vi.fn(),
			stop: vi.fn(),
			reset: vi.fn(),
		});
		const { container } = render(<VoiceBookingButton onResult={vi.fn()} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renderiza o botão 'Agendar por voz' quando está ocioso", () => {
		mockUseVoiceBooking.mockReturnValue({
			status: "idle",
			transcript: "",
			result: null,
			error: null,
			isSupported: true,
			start: vi.fn(),
			stop: vi.fn(),
			reset: vi.fn(),
		});
		render(<VoiceBookingButton onResult={vi.fn()} />);
		expect(
			screen.getByRole("button", { name: /Agendar por voz/i }),
		).toBeInTheDocument();
	});

	it("chama start ao clicar no botão em estado ocioso", async () => {
		const start = vi.fn();
		mockUseVoiceBooking.mockReturnValue({
			status: "idle",
			transcript: "",
			result: null,
			error: null,
			isSupported: true,
			start,
			stop: vi.fn(),
			reset: vi.fn(),
		});
		render(<VoiceBookingButton onResult={vi.fn()} />);
		await userEvent.click(
			screen.getByRole("button", { name: /Agendar por voz/i }),
		);
		expect(start).toHaveBeenCalledTimes(1);
	});

	it("mostra 'Parar gravação' e chama stop ao clicar durante a escuta", async () => {
		const stop = vi.fn();
		mockUseVoiceBooking.mockReturnValue({
			status: "listening",
			transcript: "",
			result: null,
			error: null,
			isSupported: true,
			start: vi.fn(),
			stop,
			reset: vi.fn(),
		});
		render(<VoiceBookingButton onResult={vi.fn()} />);
		const button = screen.getByRole("button", { name: /Parar gravação/i });
		await userEvent.click(button);
		expect(stop).toHaveBeenCalledTimes(1);
	});

	it("desabilita o botão e mostra o loader durante o processamento", () => {
		mockUseVoiceBooking.mockReturnValue({
			status: "processing",
			transcript: "",
			result: null,
			error: null,
			isSupported: true,
			start: vi.fn(),
			stop: vi.fn(),
			reset: vi.fn(),
		});
		render(<VoiceBookingButton onResult={vi.fn()} />);
		expect(screen.getByText("Processando...")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("mostra a transcrição e a mensagem de erro quando presentes", () => {
		mockUseVoiceBooking.mockReturnValue({
			status: "error",
			transcript: "Quero marcar consulta",
			result: null,
			error: "Erro de reconhecimento: network",
			isSupported: true,
			start: vi.fn(),
			stop: vi.fn(),
			reset: vi.fn(),
		});
		render(<VoiceBookingButton onResult={vi.fn()} />);
		expect(screen.getByText('"Quero marcar consulta"')).toBeInTheDocument();
		expect(
			screen.getByText("Erro de reconhecimento: network"),
		).toBeInTheDocument();
	});

	it("renderiza o card de resultado e propaga onUse/onReset quando o status é done", async () => {
		const onResult = vi.fn();
		const reset = vi.fn();
		const result = { summary: "Consulta de cardiologia amanhã" };
		mockUseVoiceBooking.mockReturnValue({
			status: "done",
			transcript: "Quero marcar consulta",
			result,
			error: null,
			isSupported: true,
			start: vi.fn(),
			stop: vi.fn(),
			reset,
		});
		render(<VoiceBookingButton onResult={onResult} />);

		expect(
			screen.getByText("Consulta de cardiologia amanhã"),
		).toBeInTheDocument();

		await userEvent.click(screen.getByText("usar"));
		expect(onResult).toHaveBeenCalledWith(result);
		expect(reset).toHaveBeenCalledTimes(1);

		await userEvent.click(screen.getByText("resetar"));
		expect(reset).toHaveBeenCalledTimes(2);
	});
});
