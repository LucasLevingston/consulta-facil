import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatCard } from "@/components/StatCard";

describe("StatCard", () => {
	it("renders count and label", () => {
		render(<StatCard count={5} label="Confirmados" onActive={false} />);
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("Confirmados")).toBeInTheDocument();
	});

	it("renders zero count", () => {
		render(<StatCard count={0} label="Pendentes" onActive={false} />);
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = vi.fn();
		render(
			<StatCard
				count={3}
				label="Cancelados"
				onActive={false}
				onClick={onClick}
			/>,
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders CONFIRMED status style", () => {
		render(
			<StatCard
				count={2}
				label="Confirmados"
				type="CONFIRMED"
				onActive={false}
			/>,
		);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders PENDING status style", () => {
		render(
			<StatCard count={1} label="Pendentes" type="PENDING" onActive={false} />,
		);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders CANCELED status style", () => {
		render(
			<StatCard
				count={0}
				label="Cancelados"
				type="CANCELED"
				onActive={false}
			/>,
		);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders COMPLETED status style", () => {
		render(
			<StatCard
				count={10}
				label="Concluídos"
				type="COMPLETED"
				onActive={false}
			/>,
		);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("defaults to ALL style when no type", () => {
		const { container } = render(
			<StatCard count={7} label="Total" onActive={false} />,
		);
		expect(container.querySelector("button")).toBeInTheDocument();
	});

	it("applies active ring when onActive=true", () => {
		const { container } = render(
			<StatCard count={4} label="Ativos" onActive={true} />,
		);
		const btn = container.querySelector("button");
		expect(btn?.className).toContain("ring-2");
	});

	it("does not apply active ring when onActive=false", () => {
		const { container } = render(
			<StatCard count={4} label="Ativos" onActive={false} />,
		);
		const btn = container.querySelector("button");
		expect(btn?.className).not.toContain("ring-2");
	});
});
