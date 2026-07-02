import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppointmentCancellationCard } from "@/components/appointments/detail/AppointmentCancellationCard";

describe("AppointmentCancellationCard", () => {
	it("renders the reason text", () => {
		render(<AppointmentCancellationCard reason="Paciente não compareceu" />);
		expect(screen.getByText("Paciente não compareceu")).toBeInTheDocument();
	});

	it("renders the title", () => {
		render(<AppointmentCancellationCard reason="any" />);
		expect(screen.getByText("Motivo do cancelamento")).toBeInTheDocument();
	});

	it("renders different reasons", () => {
		render(<AppointmentCancellationCard reason="Emergência médica" />);
		expect(screen.getByText("Emergência médica")).toBeInTheDocument();
	});
});
