import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResetPasswordMobileLogo } from "./ResetPasswordMobileLogo";

describe("ResetPasswordMobileLogo", () => {
	it("renders brand name", () => {
		render(<ResetPasswordMobileLogo />);
		expect(screen.getByText("Consulta Fácil")).toBeInTheDocument();
	});

	it("has lg:hidden class on container", () => {
		const { container } = render(<ResetPasswordMobileLogo />);
		expect(container.firstChild).toHaveClass("lg:hidden");
	});

	it("renders svg check icon", () => {
		const { container } = render(<ResetPasswordMobileLogo />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});
