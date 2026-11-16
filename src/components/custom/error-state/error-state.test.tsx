import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./error-state";

describe("ErrorState", () => {
	it("shows the default message and no retry button", () => {
		render(<ErrorState />);

		expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("shows a custom message", () => {
		render(<ErrorState message="Falha ao buscar consultas" />);

		expect(screen.getByText("Falha ao buscar consultas")).toBeInTheDocument();
	});

	it("calls onRetry from the retry button", async () => {
		const onRetry = vi.fn();
		render(<ErrorState onRetry={onRetry} />);

		await userEvent.click(
			screen.getByRole("button", { name: "Tentar novamente" }),
		);

		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("merges extra classes into the container", () => {
		const { container } = render(<ErrorState className="min-h-40" />);

		expect(container.firstChild).toHaveClass("min-h-40", "text-destructive");
	});
});
