import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ClinicHoursRow } from "@/components/custom/clinic/ClinicHoursRow";

const openRow = {
	dayOfWeek: "MONDAY" as const,
	openTime: "08:00",
	closeTime: "18:00",
	isOpen: true,
};

describe("ClinicHoursRow", () => {
	it("renderiza o rótulo do dia da semana", () => {
		render(<ClinicHoursRow row={openRow} onUpdate={vi.fn()} />);
		expect(screen.getByText("Segunda")).toBeInTheDocument();
	});

	it("mostra badge 'Aberto' quando isOpen é true", () => {
		render(<ClinicHoursRow row={openRow} onUpdate={vi.fn()} />);
		expect(screen.getByText("Aberto")).toBeInTheDocument();
	});

	it("mostra badge 'Fechado' quando isOpen é false", () => {
		render(
			<ClinicHoursRow row={{ ...openRow, isOpen: false }} onUpdate={vi.fn()} />,
		);
		expect(screen.getByText("Fechado")).toBeInTheDocument();
	});

	it("renderiza os horários de abertura e fechamento", () => {
		render(<ClinicHoursRow row={openRow} onUpdate={vi.fn()} />);
		expect(screen.getByDisplayValue("08:00")).toBeInTheDocument();
		expect(screen.getByDisplayValue("18:00")).toBeInTheDocument();
	});

	it("desabilita os inputs de horário quando o dia está fechado", () => {
		render(
			<ClinicHoursRow row={{ ...openRow, isOpen: false }} onUpdate={vi.fn()} />,
		);
		expect(screen.getByDisplayValue("08:00")).toBeDisabled();
		expect(screen.getByDisplayValue("18:00")).toBeDisabled();
	});

	it("chama onUpdate com isOpen ao alternar o switch", async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(<ClinicHoursRow row={openRow} onUpdate={onUpdate} />);
		await user.click(screen.getByRole("switch"));
		expect(onUpdate).toHaveBeenCalledWith("MONDAY", { isOpen: false });
	});

	it("chama onUpdate com openTime ao alterar o horário de abertura", () => {
		const onUpdate = vi.fn();
		render(<ClinicHoursRow row={openRow} onUpdate={onUpdate} />);
		const input = screen.getByDisplayValue("08:00");
		fireEvent.change(input, { target: { value: "09:00" } });
		expect(onUpdate).toHaveBeenCalledWith("MONDAY", { openTime: "09:00" });
	});

	it("chama onUpdate com closeTime ao alterar o horário de fechamento", () => {
		const onUpdate = vi.fn();
		render(<ClinicHoursRow row={openRow} onUpdate={onUpdate} />);
		const input = screen.getByDisplayValue("18:00");
		fireEvent.change(input, { target: { value: "19:00" } });
		expect(onUpdate).toHaveBeenCalledWith("MONDAY", { closeTime: "19:00" });
	});

	it("aplica opacidade reduzida ao card quando o dia está fechado", () => {
		const { container } = render(
			<ClinicHoursRow row={{ ...openRow, isOpen: false }} onUpdate={vi.fn()} />,
		);
		expect(container.querySelector(".opacity-60")).toBeInTheDocument();
	});
});
