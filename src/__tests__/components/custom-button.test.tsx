import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomButton } from "@/components/custom/custom-button";

describe("CustomButton", () => {
	it("renders children", () => {
		render(<CustomButton>Clique aqui</CustomButton>);
		expect(screen.getByText("Clique aqui")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = vi.fn();
		render(<CustomButton onClick={onClick}>Clique</CustomButton>);
		await userEvent.click(screen.getByText("Clique"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("disabled button does not call onClick", async () => {
		const onClick = vi.fn();
		render(
			<CustomButton disabled onClick={onClick}>
				Clique
			</CustomButton>,
		);
		await userEvent.click(screen.getByText("Clique"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("renders with default variant", () => {
		render(<CustomButton>Texto</CustomButton>);
		const btn = screen.getByRole("button");
		expect(btn).toBeInTheDocument();
	});

	it("renders with ghost variant", () => {
		render(<CustomButton variant="ghost">Ghost</CustomButton>);
		expect(screen.getByText("Ghost")).toBeInTheDocument();
	});

	it("renders with outline variant", () => {
		render(<CustomButton variant="outline">Outline</CustomButton>);
		expect(screen.getByText("Outline")).toBeInTheDocument();
	});

	it("renders with destructive variant", () => {
		render(<CustomButton variant="destructive">Delete</CustomButton>);
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<CustomButton className="my-class">Test</CustomButton>);
		expect(screen.getByRole("button")).toHaveClass("my-class");
	});
});
