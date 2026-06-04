import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CustomInput } from "@/components/custom/custom-input";

describe("CustomInput", () => {
	it("renders input element", () => {
		render(<CustomInput />);
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("accepts and displays typed value", async () => {
		render(<CustomInput />);
		const input = screen.getByRole("textbox");
		await userEvent.type(input, "texto teste");
		expect(input).toHaveValue("texto teste");
	});

	it("passes placeholder to input", () => {
		render(<CustomInput placeholder="Digite aqui" />);
		expect(screen.getByPlaceholderText("Digite aqui")).toBeInTheDocument();
	});

	it("passes name prop to input", () => {
		render(<CustomInput name="email" />);
		expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
	});

	it("renders with password type", () => {
		const { container } = render(<CustomInput type="password" />);
		const input = container.querySelector("input[type='password']");
		expect(input).toBeInTheDocument();
	});

	it("renders with explicit Icon prop", () => {
		const Icon = () => <svg data-testid="custom-icon" />;
		render(<CustomInput icon={Icon} />);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<CustomInput className="my-custom-class" />);
		const input = screen.getByRole("textbox");
		expect(input.className).toContain("my-custom-class");
	});

	it("disables input when disabled prop passed", () => {
		render(<CustomInput disabled />);
		expect(screen.getByRole("textbox")).toBeDisabled();
	});
});
