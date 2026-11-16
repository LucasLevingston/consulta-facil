import { render, screen } from "@testing-library/react";
import { Clock } from "lucide-react";
import { describe, expect, it } from "vitest";
import { QuickAccessCard } from "./QuickAccessCard";

describe("QuickAccessCard", () => {
	it("links to the destination with its title and description", () => {
		render(
			<QuickAccessCard
				title="Horários"
				description="Gerencie sua disponibilidade semanal."
				href="/dashboard/schedule"
				icon={Clock}
				accent="bg-blue-500/10 text-blue-500"
			/>,
		);

		const link = screen.getByRole("link", { name: /Horários/ });
		expect(link).toHaveAttribute("href", "/dashboard/schedule");
		expect(
			screen.getByText("Gerencie sua disponibilidade semanal."),
		).toBeInTheDocument();
	});

	it("applies the accent colors to the icon badge", () => {
		const { container } = render(
			<QuickAccessCard
				title="Horários"
				description="..."
				href="/dashboard/schedule"
				icon={Clock}
				accent="bg-blue-500/10 text-blue-500"
			/>,
		);

		expect(container.querySelector(".bg-blue-500\\/10")).toBeInTheDocument();
	});
});
