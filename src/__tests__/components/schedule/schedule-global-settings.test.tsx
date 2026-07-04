import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScheduleGlobalSettings } from "@/components/schedule/ScheduleGlobalSettings";

describe("ScheduleGlobalSettings", () => {
	it("renderiza os valores padrão de duração e intervalo", () => {
		render(
			<ScheduleGlobalSettings
				defaultDuration={30}
				defaultBreak={10}
				onApply={vi.fn()}
			/>,
		);
		expect(screen.getByLabelText("Duração da consulta (min)")).toHaveValue(30);
		expect(
			screen.getByLabelText("Intervalo entre consultas (min)"),
		).toHaveValue(10);
	});

	it("atualiza o valor de duração ao digitar", () => {
		render(
			<ScheduleGlobalSettings
				defaultDuration={30}
				defaultBreak={10}
				onApply={vi.fn()}
			/>,
		);
		const input = screen.getByLabelText("Duração da consulta (min)");
		fireEvent.change(input, { target: { value: "45" } });
		expect(input).toHaveValue(45);
	});

	it("atualiza o valor de intervalo ao digitar", () => {
		render(
			<ScheduleGlobalSettings
				defaultDuration={30}
				defaultBreak={10}
				onApply={vi.fn()}
			/>,
		);
		const input = screen.getByLabelText("Intervalo entre consultas (min)");
		fireEvent.change(input, { target: { value: "15" } });
		expect(input).toHaveValue(15);
	});

	it("chama onApply com a duração e o intervalo atuais ao clicar em aplicar", () => {
		const onApply = vi.fn();
		render(
			<ScheduleGlobalSettings
				defaultDuration={30}
				defaultBreak={10}
				onApply={onApply}
			/>,
		);
		fireEvent.change(screen.getByLabelText("Duração da consulta (min)"), {
			target: { value: "60" },
		});
		fireEvent.change(screen.getByLabelText("Intervalo entre consultas (min)"), {
			target: { value: "20" },
		});
		fireEvent.click(screen.getByText("Aplicar a todos os dias"));
		expect(onApply).toHaveBeenCalledWith(60, 20);
	});

	it("reseta os valores quando defaultDuration e defaultBreak mudam", () => {
		const { rerender } = render(
			<ScheduleGlobalSettings
				defaultDuration={30}
				defaultBreak={10}
				onApply={vi.fn()}
			/>,
		);
		rerender(
			<ScheduleGlobalSettings
				defaultDuration={50}
				defaultBreak={5}
				onApply={vi.fn()}
			/>,
		);
		expect(screen.getByLabelText("Duração da consulta (min)")).toHaveValue(50);
		expect(
			screen.getByLabelText("Intervalo entre consultas (min)"),
		).toHaveValue(5);
	});
});
