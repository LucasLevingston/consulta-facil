import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsPeriodSelect } from "./AnalyticsPeriodSelect";

describe("AnalyticsPeriodSelect", () => {
	it("renders the three periods and marks the selected one as pressed", () => {
		render(<AnalyticsPeriodSelect value="90d" onChange={vi.fn()} />);

		expect(screen.getByRole("group", { name: "Período" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "30 dias" })).toHaveAttribute(
			"aria-pressed",
			"false",
		);
		expect(screen.getByRole("button", { name: "90 dias" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(
			screen.getByRole("button", { name: "12 meses" }),
		).toBeInTheDocument();
	});

	it("reports the clicked period", async () => {
		const onChange = vi.fn();
		render(<AnalyticsPeriodSelect value="30d" onChange={onChange} />);

		await userEvent.click(screen.getByRole("button", { name: "12 meses" }));

		expect(onChange).toHaveBeenCalledWith("12m");
	});

	it("disables every option while a period is loading", () => {
		render(<AnalyticsPeriodSelect value="30d" onChange={vi.fn()} disabled />);

		for (const button of screen.getAllByRole("button")) {
			expect(button).toBeDisabled();
		}
	});
});
