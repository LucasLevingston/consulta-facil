import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/features/appointments", () => ({
	useRateAppointment: vi.fn(),
}));

import { toast } from "sonner";
import { RateAppointmentForm } from "@/components/forms/Appointments/RateAppointmentForm";
import { StarRating } from "@/components/forms/Appointments/StarRating";
import { useRateAppointment } from "@/features/appointments";

const mockUseRateAppointment = vi.mocked(useRateAppointment);

const appointment = {
	id: "appt-1",
	professionalName: "Dr. João",
} as never;

describe("StarRating", () => {
	it("renderiza as 5 estrelas", () => {
		render(
			<StarRating
				active={0}
				onStarClick={vi.fn()}
				onStarHover={vi.fn()}
				onMouseLeave={vi.fn()}
			/>,
		);

		expect(screen.getAllByRole("button")).toHaveLength(5);
	});

	it("não mostra rótulo quando nenhuma estrela está ativa", () => {
		render(
			<StarRating
				active={0}
				onStarClick={vi.fn()}
				onStarHover={vi.fn()}
				onMouseLeave={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Excelente")).not.toBeInTheDocument();
	});

	it("mostra o rótulo correspondente à quantidade de estrelas ativas", () => {
		render(
			<StarRating
				active={5}
				onStarClick={vi.fn()}
				onStarHover={vi.fn()}
				onMouseLeave={vi.fn()}
			/>,
		);

		expect(screen.getByText("Excelente")).toBeInTheDocument();
	});

	it("chama onStarClick com o número da estrela clicada", async () => {
		const user = userEvent.setup();
		const onStarClick = vi.fn();

		render(
			<StarRating
				active={0}
				onStarClick={onStarClick}
				onStarHover={vi.fn()}
				onMouseLeave={vi.fn()}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "3 estrelas" }));

		expect(onStarClick).toHaveBeenCalledWith(3);
	});

	it("chama onStarHover ao passar o mouse sobre uma estrela", async () => {
		const user = userEvent.setup();
		const onStarHover = vi.fn();

		render(
			<StarRating
				active={0}
				onStarClick={vi.fn()}
				onStarHover={onStarHover}
				onMouseLeave={vi.fn()}
			/>,
		);

		await user.hover(screen.getByRole("button", { name: "1 estrela" }));

		expect(onStarHover).toHaveBeenCalledWith(1);
	});

	it("chama onMouseLeave ao tirar o mouse do grupo de estrelas", async () => {
		const user = userEvent.setup();
		const onMouseLeave = vi.fn();

		render(
			<StarRating
				active={0}
				onStarClick={vi.fn()}
				onStarHover={vi.fn()}
				onMouseLeave={onMouseLeave}
			/>,
		);

		await user.hover(screen.getByRole("button", { name: "1 estrela" }));
		await user.unhover(screen.getByRole("button", { name: "1 estrela" }));

		expect(onMouseLeave).toHaveBeenCalled();
	});
});

describe("RateAppointmentForm", () => {
	it("renderiza o nome do profissional avaliado", () => {
		mockUseRateAppointment.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<RateAppointmentForm appointment={appointment} setOpen={vi.fn()} />);

		expect(screen.getByText("Dr. João")).toBeInTheDocument();
	});

	it("mantém o botão de enviar desabilitado enquanto nenhuma estrela é escolhida", () => {
		mockUseRateAppointment.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<RateAppointmentForm appointment={appointment} setOpen={vi.fn()} />);

		expect(
			screen.getByRole("button", { name: "Enviar avaliação" }),
		).toBeDisabled();
	});

	it("mostra erro e não envia quando tenta submeter sem escolher estrelas", () => {
		const mutateAsync = vi.fn();
		mockUseRateAppointment.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);

		render(<RateAppointmentForm appointment={appointment} setOpen={vi.fn()} />);

		// dispara o submit do form diretamente, já que o botão fica desabilitado no DOM
		const form = screen
			.getByRole("button", { name: "Enviar avaliação" })
			.closest("form");
		if (form) fireEvent.submit(form);

		expect(toast.error).toHaveBeenCalledWith(
			"Selecione uma avaliação de 1 a 5 estrelas.",
		);
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it("envia a avaliação com as estrelas escolhidas e o comentário digitado", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseRateAppointment.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const setOpen = vi.fn();

		render(<RateAppointmentForm appointment={appointment} setOpen={setOpen} />);

		await user.click(screen.getByRole("button", { name: "4 estrelas" }));
		await user.type(
			screen.getByPlaceholderText("Conte como foi sua experiência..."),
			"Ótimo atendimento",
		);
		await user.click(screen.getByRole("button", { name: "Enviar avaliação" }));

		expect(mutateAsync).toHaveBeenCalledWith({
			id: "appt-1",
			data: { stars: 4, comment: "Ótimo atendimento" },
		});
		expect(toast.success).toHaveBeenCalledWith(
			"Avaliação enviada com sucesso!",
		);
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it("mostra toast de erro quando o envio da avaliação falha", async () => {
		const user = userEvent.setup();
		mockUseRateAppointment.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("network error")),
			isPending: false,
		} as never);

		render(<RateAppointmentForm appointment={appointment} setOpen={vi.fn()} />);

		await user.click(screen.getByRole("button", { name: "2 estrelas" }));
		await user.click(screen.getByRole("button", { name: "Enviar avaliação" }));

		expect(toast.error).toHaveBeenCalledWith("Erro ao enviar avaliação.");
	});
});
