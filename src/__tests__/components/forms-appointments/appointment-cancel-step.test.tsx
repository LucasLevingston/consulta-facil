import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

// PaymentStep não faz parte do escopo desta issue e depende de @/features/professionals;
// mockamos para isolar o teste do AppointmentCancelStep.
vi.mock("@/components/forms/Appointments/steps/PaymentStep", () => ({
	PaymentStep: () => <div data-testid="payment-step">payment-step</div>,
}));

import { AppointmentCancelStep } from "@/components/forms/Appointments/AppointmentCancelStep";
import type { AppointmentCancelStepProps } from "@/components/forms/Appointments/AppointmentCancelStep.types";

type FormValues = { cancellationReason: string };

function Wrapper({
	onSubmit,
	isPending = false,
	selectedProfessional,
}: {
	onSubmit: (values: FormValues) => void;
	isPending?: boolean;
	selectedProfessional?: unknown;
}) {
	const form = useForm<FormValues>({
		defaultValues: { cancellationReason: "" },
	});

	const hook = {
		form,
		onSubmit: form.handleSubmit(onSubmit),
		isPending,
		selectedProfessional,
	} as unknown as AppointmentCancelStepProps["hook"];

	return <AppointmentCancelStep hook={hook} />;
}

describe("AppointmentCancelStep", () => {
	it("renderiza o label do motivo de cancelamento", () => {
		render(<Wrapper onSubmit={vi.fn()} />);

		expect(screen.getByText("Motivo do cancelamento")).toBeInTheDocument();
	});

	it("renderiza o botão de cancelar consulta", () => {
		render(<Wrapper onSubmit={vi.fn()} />);

		expect(
			screen.getByRole("button", { name: "Cancelar Consulta" }),
		).toBeInTheDocument();
	});

	it("não renderiza o PaymentStep quando não há profissional selecionado", () => {
		render(<Wrapper onSubmit={vi.fn()} selectedProfessional={undefined} />);

		expect(screen.queryByTestId("payment-step")).not.toBeInTheDocument();
	});

	it("renderiza o PaymentStep quando há um profissional selecionado", () => {
		render(
			<Wrapper onSubmit={vi.fn()} selectedProfessional={{ id: "prof-1" }} />,
		);

		expect(screen.getByTestId("payment-step")).toBeInTheDocument();
	});

	it("mostra 'Cancelando...' e desabilita o botão quando isPending é true", () => {
		render(<Wrapper onSubmit={vi.fn()} isPending />);

		const button = screen.getByRole("button", { name: "Cancelando..." });
		expect(button).toBeDisabled();
	});

	it("preenche o motivo e chama onSubmit com o valor digitado ao submeter", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();

		render(<Wrapper onSubmit={onSubmit} />);

		await user.type(
			screen.getByPlaceholderText("Descreva o motivo do cancelamento..."),
			"Paciente remarcou por conta própria",
		);
		await user.click(screen.getByRole("button", { name: "Cancelar Consulta" }));

		expect(onSubmit).toHaveBeenCalledWith(
			{ cancellationReason: "Paciente remarcou por conta própria" },
			expect.anything(),
		);
	});
});
