import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PatientCtaCard } from "./PatientCtaCard";

describe("PatientCtaCard", () => {
	it("invites patients to become professionals", () => {
		render(<PatientCtaCard />);

		const link = screen.getByRole("link", {
			name: /É profissional de saúde\?/,
		});
		expect(link).toHaveAttribute("href", "/dashboard/become-professional");
		expect(
			screen.getByText(/Cadastre-se como profissional de saúde/),
		).toBeInTheDocument();
	});
});
