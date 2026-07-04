import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScheduleDayRow } from "@/components/schedule/ScheduleDayRow";

const activeRow = {
	dayOfWeek: "MONDAY" as const,
	startTime: "08:00",
	endTime: "18:00",
	consultationDurationMinutes: 30,
	breakBetweenConsultationsMinutes: 10,
	isActive: true,
};

describe("ScheduleDayRow", () => {
	it("renderiza o rótulo do dia da semana", () => {
		render(<ScheduleDayRow row={activeRow} onChange={vi.fn()} />);
		expect(screen.getByText("Segunda")).toBeInTheDocument();
	});

	it("mostra badge 'Ativo' quando o dia está ativo", () => {
		render(<ScheduleDayRow row={activeRow} onChange={vi.fn()} />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("mostra badge 'Fechado' quando o dia está inativo", () => {
		render(
			<ScheduleDayRow
				row={{ ...activeRow, isActive: false }}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Fechado")).toBeInTheDocument();
	});

	it("renderiza os horários de início e fim", () => {
		render(<ScheduleDayRow row={activeRow} onChange={vi.fn()} />);
		expect(screen.getByDisplayValue("08:00")).toBeInTheDocument();
		expect(screen.getByDisplayValue("18:00")).toBeInTheDocument();
	});

	it("desabilita os inputs de horário quando o dia está inativo", () => {
		render(
			<ScheduleDayRow
				row={{ ...activeRow, isActive: false }}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByDisplayValue("08:00")).toBeDisabled();
		expect(screen.getByDisplayValue("18:00")).toBeDisabled();
	});

	it("chama onChange com isActive ao alternar o switch", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ScheduleDayRow row={activeRow} onChange={onChange} />);
		await user.click(screen.getByRole("switch"));
		expect(onChange).toHaveBeenCalledWith({ isActive: false });
	});

	it("chama onChange com startTime ao alterar o horário de início", () => {
		const onChange = vi.fn();
		render(<ScheduleDayRow row={activeRow} onChange={onChange} />);
		const input = screen.getByDisplayValue("08:00");
		fireEvent.change(input, { target: { value: "09:30" } });
		expect(onChange).toHaveBeenCalledWith({ startTime: "09:30" });
	});

	it("chama onChange com endTime ao alterar o horário de fim", () => {
		const onChange = vi.fn();
		render(<ScheduleDayRow row={activeRow} onChange={onChange} />);
		const input = screen.getByDisplayValue("18:00");
		fireEvent.change(input, { target: { value: "19:30" } });
		expect(onChange).toHaveBeenCalledWith({ endTime: "19:30" });
	});

	it("aplica opacidade reduzida ao card quando o dia está inativo", () => {
		const { container } = render(
			<ScheduleDayRow
				row={{ ...activeRow, isActive: false }}
				onChange={vi.fn()}
			/>,
		);
		expect(container.querySelector(".opacity-60")).toBeInTheDocument();
	});
});
