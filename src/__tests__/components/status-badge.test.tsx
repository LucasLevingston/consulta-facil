import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/StatusBadge";

describe("StatusBadge", () => {
	it("renders CONFIRMED status", () => {
		render(<StatusBadge status="CONFIRMED" />);
		expect(screen.getByText("Confirmada")).toBeInTheDocument();
	});

	it("renders PENDING status", () => {
		render(<StatusBadge status="PENDING" />);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("renders CANCELED status", () => {
		render(<StatusBadge status="CANCELED" />);
		expect(screen.getByText("Cancelada")).toBeInTheDocument();
	});

	it("renders COMPLETED status", () => {
		render(<StatusBadge status="COMPLETED" />);
		expect(screen.getByText("Concluída")).toBeInTheDocument();
	});

	it("renders CHECKED_IN status", () => {
		render(<StatusBadge status="CHECKED_IN" />);
		expect(screen.getByText("Check-in feito")).toBeInTheDocument();
	});

	it("renders IN_PROGRESS status", () => {
		render(<StatusBadge status="IN_PROGRESS" />);
		expect(screen.getByText("Em atendimento")).toBeInTheDocument();
	});

	it("renders as span element", () => {
		const { container } = render(<StatusBadge status="CONFIRMED" />);
		expect(container.querySelector("span")).toBeInTheDocument();
	});
});
