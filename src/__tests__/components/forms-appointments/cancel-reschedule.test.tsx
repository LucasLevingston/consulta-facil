import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// O resolver real do zod exige objetos válidos; substituímos por um resolver que
// simplesmente ecoa os valores atuais do formulário, permitindo testar a submissão
// com os dados reais digitados pelo usuário sem depender da validação do schema.
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: () => async (values: unknown) => ({ errors: {}, values }),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/features/appointments", () => ({
	cancelAppointmentSchema: {},
	rescheduleAppointmentSchema: {},
}));
vi.mock("@/components/forms/Appointments/use-cancel-appointment", () => ({
	useCancelAppointment: vi.fn(),
}));
vi.mock("@/components/forms/Appointments/use-reschedule-appointment", () => ({
	useRescheduleAppointment: vi.fn(),
}));

// Mocka o campo de formulário genérico usado pelos dois componentes, ligando os
// inputs diretamente ao react-hook-form real (via form.register/form.setValue)
// para manter o fluxo de submissão realista.
vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	default: ({
		form,
		name,
		label,
		placeholder,
		fieldType,
	}: {
		form: {
			register: (name: string) => Record<string, unknown>;
			setValue: (name: string, value: unknown) => void;
		};
		name: string;
		label?: string;
		placeholder?: string;
		fieldType: string;
	}) => {
		if (fieldType === "DATE_PICKER") {
			return (
				<button
					type="button"
					onClick={() => form.setValue(name, new Date("2026-08-10T10:00:00"))}
				>
					{label ?? name}
				</button>
			);
		}
		return (
			<div>
				{label && <label htmlFor={name}>{label}</label>}
				<textarea
					id={name}
					placeholder={placeholder}
					{...form.register(name)}
				/>
			</div>
		);
	},
	FormFieldType: {
		INPUT: "INPUT",
		EMAIL: "EMAIL",
		PASSWORD: "PASSWORD",
		TEXTAREA: "TEXTAREA",
		SELECT: "SELECT",
		DATE_PICKER: "DATE_PICKER",
		CHECKBOX: "CHECKBOX",
	},
}));

import { toast } from "sonner";
import { CancelAppointmentForm } from "@/components/forms/Appointments/CancelAppointmentForm";
import { RescheduleAppointmentForm } from "@/components/forms/Appointments/RescheduleAppointmentForm";
import { useCancelAppointment } from "@/components/forms/Appointments/use-cancel-appointment";
import { useRescheduleAppointment } from "@/components/forms/Appointments/use-reschedule-appointment";

const mockUseCancelAppointment = vi.mocked(useCancelAppointment);
const mockUseRescheduleAppointment = vi.mocked(useRescheduleAppointment);

const appointment = {
	id: "appt-1",
	professionalName: "Dra. Ana",
	reason: "Motivo anterior",
} as never;

describe("CancelAppointmentForm", () => {
	it("renderiza o nome do profissional na confirmação", () => {
		mockUseCancelAppointment.mockReturnValue({
			mutateAsync: vi.fn(),
		} as never);

		render(
			<CancelAppointmentForm appointment={appointment} setOpen={vi.fn()} />,
		);

		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
	});

	it("chama useCancelAppointment com o id e o motivo digitado ao submeter", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseCancelAppointment.mockReturnValue({ mutateAsync } as never);
		const setOpen = vi.fn();

		render(
			<CancelAppointmentForm appointment={appointment} setOpen={setOpen} />,
		);

		await user.type(
			screen.getByPlaceholderText("Descreva o motivo..."),
			"Conflito de agenda",
		);
		await user.click(
			screen.getByRole("button", { name: "Confirmar cancelamento" }),
		);

		await waitFor(() =>
			expect(mutateAsync).toHaveBeenCalledWith({
				id: "appt-1",
				data: { cancellationReason: "Conflito de agenda" },
			}),
		);
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it("mostra toast de erro quando o cancelamento falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi
			.fn()
			.mockRejectedValue(new Error("Falha no servidor"));
		mockUseCancelAppointment.mockReturnValue({ mutateAsync } as never);

		render(
			<CancelAppointmentForm appointment={appointment} setOpen={vi.fn()} />,
		);

		await user.type(
			screen.getByPlaceholderText("Descreva o motivo..."),
			"Motivo qualquer",
		);
		await user.click(
			screen.getByRole("button", { name: "Confirmar cancelamento" }),
		);

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("Falha no servidor"),
		);
	});
});

describe("RescheduleAppointmentForm", () => {
	it("preenche o campo motivo com o motivo atual da consulta", () => {
		mockUseRescheduleAppointment.mockReturnValue({
			mutateAsync: vi.fn(),
		} as never);

		render(
			<RescheduleAppointmentForm appointment={appointment} setOpen={vi.fn()} />,
		);

		expect(screen.getByDisplayValue("Motivo anterior")).toBeInTheDocument();
	});

	it("chama useRescheduleAppointment com a nova data ao submeter", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseRescheduleAppointment.mockReturnValue({ mutateAsync } as never);
		const setOpen = vi.fn();

		render(
			<RescheduleAppointmentForm appointment={appointment} setOpen={setOpen} />,
		);

		await user.click(
			screen.getByRole("button", { name: "Nova data e horário" }),
		);
		await user.click(
			screen.getByRole("button", { name: "Confirmar remarcação" }),
		);

		await waitFor(() =>
			expect(mutateAsync).toHaveBeenCalledWith({
				id: "appt-1",
				data: {
					scheduledAt: new Date("2026-08-10T10:00:00"),
					reason: "Motivo anterior",
				},
			}),
		);
		expect(setOpen).toHaveBeenCalledWith(false);
	});

	it("mostra toast de erro quando a remarcação falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi
			.fn()
			.mockRejectedValue(new Error("Horário indisponível"));
		mockUseRescheduleAppointment.mockReturnValue({ mutateAsync } as never);

		render(
			<RescheduleAppointmentForm appointment={appointment} setOpen={vi.fn()} />,
		);

		await user.click(
			screen.getByRole("button", { name: "Nova data e horário" }),
		);
		await user.click(
			screen.getByRole("button", { name: "Confirmar remarcação" }),
		);

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("Horário indisponível"),
		);
	});
});
