import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScheduleDaysList } from "@/components/schedule/ScheduleDaysList";

const rows = [
	{
		dayOfWeek: "MONDAY" as const,
		startTime: "08:00",
		endTime: "18:00",
		consultationDurationMinutes: 30,
		breakBetweenConsultationsMinutes: 10,
		isActive: true,
	},
	{
		dayOfWeek: "SATURDAY" as const,
		startTime: "08:00",
		endTime: "12:00",
		consultationDurationMinutes: 30,
		breakBetweenConsultationsMinutes: 10,
		isActive: false,
	},
];

describe("ScheduleDaysList", () => {
	it("renderiza o título da seção", () => {
		render(<ScheduleDaysList rows={rows} onUpdate={vi.fn()} />);
		expect(screen.getByText("Dias da semana")).toBeInTheDocument();
	});

	it("renderiza uma linha para cada dia da semana informado", () => {
		render(<ScheduleDaysList rows={rows} onUpdate={vi.fn()} />);
		expect(screen.getByText("Segunda")).toBeInTheDocument();
		expect(screen.getByText("Sábado")).toBeInTheDocument();
	});

	it("chama onUpdate com o dia correto ao alterar o horário de uma linha", () => {
		const onUpdate = vi.fn();
		render(<ScheduleDaysList rows={rows} onUpdate={onUpdate} />);
		// primeira ocorrência de "08:00" é o horário de início de segunda-feira
		const [input] = screen.getAllByDisplayValue("08:00");
		fireEvent.change(input, { target: { value: "10:00" } });
		expect(onUpdate).toHaveBeenCalledWith("MONDAY", { startTime: "10:00" });
	});

	it("chama onUpdate com o dia correto ao alternar o switch de uma linha inativa", () => {
		const onUpdate = vi.fn();
		render(<ScheduleDaysList rows={rows} onUpdate={onUpdate} />);
		const switches = screen.getAllByRole("switch");
		fireEvent.click(switches[1]);
		expect(onUpdate).toHaveBeenCalledWith("SATURDAY", { isActive: true });
	});
});
