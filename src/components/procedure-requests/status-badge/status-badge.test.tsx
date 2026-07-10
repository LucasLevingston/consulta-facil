import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("Procedure StatusBadge", () => {
	it("renders PENDING label", () => {
		render(<StatusBadge status="PENDING" />);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("renders SCHEDULED label", () => {
		render(<StatusBadge status="SCHEDULED" />);
		expect(screen.getByText("Agendado")).toBeInTheDocument();
	});

	it("renders COMPLETED label", () => {
		render(<StatusBadge status="COMPLETED" />);
		expect(screen.getByText("Concluído")).toBeInTheDocument();
	});

	it("renders CANCELED label", () => {
		render(<StatusBadge status="CANCELED" />);
		expect(screen.getByText("Cancelado")).toBeInTheDocument();
	});
});
