import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
	it("renders children when not loading", () => {
		render(<SubmitButton isLoading={false}>Salvar</SubmitButton>);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("shows loading spinner when isLoading=true", () => {
		render(<SubmitButton isLoading={true}>Salvar</SubmitButton>);
		expect(screen.getByText("Carregando...")).toBeInTheDocument();
	});

	it("does not show children text when loading", () => {
		render(<SubmitButton isLoading={true}>Salvar</SubmitButton>);
		expect(screen.queryByText("Salvar")).not.toBeInTheDocument();
	});

	it("is disabled when isLoading=true", () => {
		render(<SubmitButton isLoading={true}>Salvar</SubmitButton>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is not disabled when isLoading=false", () => {
		render(<SubmitButton isLoading={false}>Salvar</SubmitButton>);
		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("renders as submit button", () => {
		render(<SubmitButton isLoading={false}>Enviar</SubmitButton>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("applies custom className", () => {
		render(
			<SubmitButton isLoading={false} className="extra-class">
				Enviar
			</SubmitButton>,
		);
		expect(screen.getByRole("button").className).toContain("extra-class");
	});
});
