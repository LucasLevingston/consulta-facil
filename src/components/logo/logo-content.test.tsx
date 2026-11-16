import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoContent } from "./logo-content";

describe("LogoContent", () => {
	it("renders the brand name with the gradient style", () => {
		render(<LogoContent />);

		expect(screen.getByText("Consulta Fácil")).toHaveClass("bg-clip-text");
	});

	it("forwards paragraph props and merges classes", () => {
		render(<LogoContent className="text-4xl" data-testid="brand" />);

		const brand = screen.getByTestId("brand");
		expect(brand).toHaveClass("text-4xl", "font-bold");
	});
});
