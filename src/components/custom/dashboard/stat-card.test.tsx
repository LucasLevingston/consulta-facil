import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard } from "./stat-card";

describe("Dashboard StatCard", () => {
	it("renders count and label", () => {
		render(
			<StatCard
				icon={<span data-testid="icon" />}
				count={5}
				label="Consultas"
				colorClass="bg-primary/10"
			/>,
		);
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("Consultas")).toBeInTheDocument();
	});

	it("renders icon", () => {
		render(
			<StatCard
				icon={<span data-testid="my-icon" />}
				count={0}
				label="Total"
				colorClass="bg-green-500/10"
			/>,
		);
		expect(screen.getByTestId("my-icon")).toBeInTheDocument();
	});

	it("renders zero count", () => {
		render(
			<StatCard
				icon={<span />}
				count={0}
				label="Canceladas"
				colorClass="bg-red-500/10"
			/>,
		);
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("applies colorClass to icon container", () => {
		const { container } = render(
			<StatCard
				icon={<span />}
				count={3}
				label="Pendentes"
				colorClass="bg-yellow-500/10"
			/>,
		);
		expect(container.querySelector(".bg-yellow-500\\/10")).toBeInTheDocument();
	});
});
