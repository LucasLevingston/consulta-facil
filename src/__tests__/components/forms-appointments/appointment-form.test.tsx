import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mocka o hook principal que compõe todo o wizard de agendamento.
vi.mock("@/features/appointments", () => ({
	useAppointmentFormSetup: vi.fn(),
}));

// Mocka os componentes de cada etapa do wizard para isolar o teste de composição/renderização.
vi.mock("@/components/forms/Appointments/AppointmentCancelStep", () => ({
	AppointmentCancelStep: () => <div data-testid="cancel-step">cancel-step</div>,
}));
vi.mock("@/components/forms/Appointments/ServiceSelector", () => ({
	ServiceSelector: () => (
		<div data-testid="service-selector">service-selector</div>
	),
}));
vi.mock("@/components/forms/Appointments/steps/ProfessionalStep", () => ({
	ProfessionalStep: () => (
		<div data-testid="professional-step">professional-step</div>
	),
}));
vi.mock("@/components/forms/Appointments/steps/DateTimeStep", () => ({
	DateTimeStep: () => <div data-testid="date-time-step">date-time-step</div>,
}));
vi.mock("@/components/forms/Appointments/steps/ModalityStep", () => ({
	ModalityStep: () => <div data-testid="modality-step">modality-step</div>,
}));
vi.mock("@/components/forms/Appointments/steps/DetailsStep", () => ({
	DetailsStep: () => <div data-testid="details-step">details-step</div>,
}));

import { AppointmentForm } from "@/components/forms/Appointments/AppointmentForm";
import { useAppointmentFormSetup } from "@/features/appointments";

const mockUseAppointmentFormSetup = vi.mocked(useAppointmentFormSetup);

function makeHook(overrides: Record<string, unknown> = {}) {
	return {
		form: {
			handleSubmit:
				(fn: (values: unknown) => void) =>
				(e?: { preventDefault: () => void }) => {
					e?.preventDefault();
					fn({});
				},
			control: {},
		},
		selectedProfessional: null,
		selectedServiceId: null,
		setSelectedServiceId: vi.fn(),
		isQueueMode: false,
		selectedDate: undefined,
		selectedTime: "",
		onSubmit: vi.fn(),
		isPending: false,
		...overrides,
	} as never;
}

describe("AppointmentForm", () => {
	it("renderiza as etapas do wizard quando type é 'create'", () => {
		mockUseAppointmentFormSetup.mockReturnValue(makeHook());

		render(<AppointmentForm type="create" />);

		expect(screen.getByTestId("professional-step")).toBeInTheDocument();
		expect(screen.getByTestId("date-time-step")).toBeInTheDocument();
		expect(screen.getByTestId("modality-step")).toBeInTheDocument();
		expect(screen.getByTestId("details-step")).toBeInTheDocument();
	});

	it("não renderiza o wizard e delega para AppointmentCancelStep quando type é 'cancel'", () => {
		mockUseAppointmentFormSetup.mockReturnValue(makeHook());

		render(<AppointmentForm type="cancel" />);

		expect(screen.getByTestId("cancel-step")).toBeInTheDocument();
		expect(screen.queryByTestId("professional-step")).not.toBeInTheDocument();
	});

	it("mostra o texto 'Agendar Consulta' quando type é 'schedule'", () => {
		mockUseAppointmentFormSetup.mockReturnValue(makeHook());

		render(<AppointmentForm type="schedule" />);

		expect(screen.getByText("Agendar Consulta")).toBeInTheDocument();
	});

	it("mostra o texto 'Confirmar Agendamento' quando type é 'create'", () => {
		mockUseAppointmentFormSetup.mockReturnValue(makeHook());

		render(<AppointmentForm type="create" />);

		expect(screen.getByText("Confirmar Agendamento")).toBeInTheDocument();
	});

	it("não renderiza o ServiceSelector quando nenhum profissional está selecionado", () => {
		mockUseAppointmentFormSetup.mockReturnValue(
			makeHook({ selectedProfessional: null }),
		);

		render(<AppointmentForm type="create" />);

		expect(screen.queryByTestId("service-selector")).not.toBeInTheDocument();
	});

	it("renderiza o ServiceSelector quando há um profissional selecionado", () => {
		mockUseAppointmentFormSetup.mockReturnValue(
			makeHook({
				selectedProfessional: { id: "prof-1", consultationPrice: 100 },
			}),
		);

		render(<AppointmentForm type="create" />);

		expect(screen.getByTestId("service-selector")).toBeInTheDocument();
	});

	it("mostra 'Agendando...' e desabilita o botão quando isPending é true", () => {
		mockUseAppointmentFormSetup.mockReturnValue(makeHook({ isPending: true }));

		render(<AppointmentForm type="create" />);

		const button = screen.getByRole("button", { name: /Agendando/ });
		expect(button).toBeDisabled();
	});

	it("desabilita o botão quando há data selecionada mas nenhum horário e não é fila", () => {
		mockUseAppointmentFormSetup.mockReturnValue(
			makeHook({
				isQueueMode: false,
				selectedDate: new Date("2026-08-01"),
				selectedTime: "",
			}),
		);

		render(<AppointmentForm type="create" />);

		expect(
			screen.getByRole("button", { name: /Confirmar Agendamento/ }),
		).toBeDisabled();
	});

	it("habilita o botão em modo fila mesmo sem horário selecionado", () => {
		mockUseAppointmentFormSetup.mockReturnValue(
			makeHook({
				isQueueMode: true,
				selectedDate: new Date("2026-08-01"),
				selectedTime: "",
			}),
		);

		render(<AppointmentForm type="create" />);

		expect(
			screen.getByRole("button", { name: /Confirmar Agendamento/ }),
		).not.toBeDisabled();
	});

	it("chama onSubmit do hook ao submeter o formulário", () => {
		const onSubmit = vi.fn();
		mockUseAppointmentFormSetup.mockReturnValue(makeHook({ onSubmit }));

		render(<AppointmentForm type="create" />);

		screen.getByRole("button", { name: /Confirmar Agendamento/ }).click();

		expect(onSubmit).toHaveBeenCalled();
	});
});
