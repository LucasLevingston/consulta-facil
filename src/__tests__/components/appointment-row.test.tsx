import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppointmentRow } from "@/components/custom/dashboard/appointment-row";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

const baseAppt: AppointmentResponse = {
	id: "a-1",
	status: "PENDING",
	scheduledAt: "2026-06-15T10:00:00Z",
	patientId: "p-1",
	patientName: "João Silva",
	professionalId: "prof-1",
	professionalName: "Dra. Ana Costa",
	specialty: "Cardiologia",
	reason: null,
	modality: "IN_PERSON",
} as unknown as AppointmentResponse;

describe("AppointmentRow", () => {
	it("shows patientName when isDoctor=true", () => {
		render(<AppointmentRow appointment={baseAppt} isDoctor={true} />);
		expect(screen.getByText("João Silva")).toBeInTheDocument();
	});

	it("shows professionalName when isDoctor=false", () => {
		render(<AppointmentRow appointment={baseAppt} isDoctor={false} />);
		expect(screen.getByText("Dra. Ana Costa")).toBeInTheDocument();
	});

	it("shows fallback when patientName is null and isDoctor=true", () => {
		const appt = { ...baseAppt, patientName: null };
		render(<AppointmentRow appointment={appt as never} isDoctor={true} />);
		expect(screen.getByText("Paciente não definido")).toBeInTheDocument();
	});

	it("shows fallback when professionalName is null and isDoctor=false", () => {
		const appt = { ...baseAppt, professionalName: null };
		render(<AppointmentRow appointment={appt as never} isDoctor={false} />);
		expect(screen.getByText("Profissional não definido")).toBeInTheDocument();
	});

	it("shows specialty badge when isDoctor=false", () => {
		render(<AppointmentRow appointment={baseAppt} isDoctor={false} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("does not show specialty badge when isDoctor=true", () => {
		render(<AppointmentRow appointment={baseAppt} isDoctor={true} />);
		expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
	});

	it("shows Confirmar button when isDoctor=true and status=PENDING", () => {
		const onConfirm = vi.fn();
		render(
			<AppointmentRow
				appointment={baseAppt}
				isDoctor={true}
				onConfirm={onConfirm}
			/>,
		);
		expect(screen.getByText("Confirmar")).toBeInTheDocument();
	});

	it("calls onConfirm when Confirmar clicked", async () => {
		const onConfirm = vi.fn();
		render(
			<AppointmentRow
				appointment={baseAppt}
				isDoctor={true}
				onConfirm={onConfirm}
			/>,
		);
		await userEvent.click(screen.getByText("Confirmar"));
		expect(onConfirm).toHaveBeenCalledWith("a-1");
	});

	it("shows Concluir button when isDoctor=true and status=CONFIRMED", () => {
		const appt = { ...baseAppt, status: "CONFIRMED" };
		const onComplete = vi.fn();
		render(
			<AppointmentRow
				appointment={appt as never}
				isDoctor={true}
				onComplete={onComplete}
			/>,
		);
		expect(screen.getByText("Concluir")).toBeInTheDocument();
	});

	it("calls onComplete when Concluir clicked", async () => {
		const appt = { ...baseAppt, status: "CONFIRMED" };
		const onComplete = vi.fn();
		render(
			<AppointmentRow
				appointment={appt as never}
				isDoctor={true}
				onComplete={onComplete}
			/>,
		);
		await userEvent.click(screen.getByText("Concluir"));
		expect(onComplete).toHaveBeenCalledWith("a-1");
	});

	it("does not show Confirmar when no onConfirm provided", () => {
		render(<AppointmentRow appointment={baseAppt} isDoctor={true} />);
		expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
	});

	it("does not show Confirmar when isDoctor=false", () => {
		const onConfirm = vi.fn();
		render(
			<AppointmentRow
				appointment={baseAppt}
				isDoctor={false}
				onConfirm={onConfirm}
			/>,
		);
		expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
	});
});
