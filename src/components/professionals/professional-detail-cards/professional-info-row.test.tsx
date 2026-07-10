import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ProfessionalInfoRow } from "./ProfessionalInfoRow";

describe("ProfessionalInfoRow", () => {
	it("renders label", () => {
		render(<ProfessionalInfoRow icon={Mail} label="E-mail" value="a@b.com" />);
		expect(screen.getByText("E-mail")).toBeInTheDocument();
	});

	it("renders value", () => {
		render(<ProfessionalInfoRow icon={Mail} label="E-mail" value="a@b.com" />);
		expect(screen.getByText("a@b.com")).toBeInTheDocument();
	});
});
