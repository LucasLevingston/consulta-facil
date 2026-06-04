import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";

describe("CustomSubmitButton", () => {
	it("renders children when not submitting", () => {
		render(<CustomSubmitButton>Salvar</CustomSubmitButton>);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("shows submittingText when isSubmitting=true", () => {
		render(<CustomSubmitButton isSubmitting={true}>Salvar</CustomSubmitButton>);
		expect(screen.getByText("Enviando...")).toBeInTheDocument();
	});

	it("shows custom submittingText", () => {
		render(
			<CustomSubmitButton isSubmitting={true} submittingText="Processando...">
				Salvar
			</CustomSubmitButton>,
		);
		expect(screen.getByText("Processando...")).toBeInTheDocument();
	});

	it("is disabled when isSubmitting=true", () => {
		render(<CustomSubmitButton isSubmitting={true}>Salvar</CustomSubmitButton>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is disabled when isDirty=false", () => {
		render(<CustomSubmitButton isDirty={false}>Salvar</CustomSubmitButton>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is disabled when disabled=true", () => {
		render(<CustomSubmitButton disabled={true}>Salvar</CustomSubmitButton>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is enabled when isDirty=true and not submitting", () => {
		render(
			<CustomSubmitButton isDirty={true} isSubmitting={false}>
				Salvar
			</CustomSubmitButton>,
		);
		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("renders as submit type", () => {
		render(<CustomSubmitButton>Salvar</CustomSubmitButton>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("applies custom className", () => {
		render(
			<CustomSubmitButton className="custom-cls">Salvar</CustomSubmitButton>,
		);
		expect(screen.getByRole("button").className).toContain("custom-cls");
	});
});
