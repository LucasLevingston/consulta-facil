import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./error-boundary";

function Bomb(): never {
	throw new Error("boom");
}

describe("ErrorBoundary", () => {
	it("renders children when there is no error", () => {
		render(
			<ErrorBoundary>
				<div>content</div>
			</ErrorBoundary>,
		);
		expect(screen.getByText("content")).toBeInTheDocument();
	});

	it("renders default ErrorState fallback and retries on click", () => {
		const onReset = vi.fn();
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(
			<ErrorBoundary onReset={onReset}>
				<Bomb />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
		screen.getByRole("button", { name: "Tentar novamente" }).click();
		expect(onReset).toHaveBeenCalledTimes(1);

		spy.mockRestore();
	});

	it("supports a custom fallbackRender", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(
			<ErrorBoundary
				fallbackRender={({ error }) => <div>custom: {error.message}</div>}
			>
				<Bomb />
			</ErrorBoundary>,
		);

		expect(screen.getByText("custom: boom")).toBeInTheDocument();

		spy.mockRestore();
	});
});
