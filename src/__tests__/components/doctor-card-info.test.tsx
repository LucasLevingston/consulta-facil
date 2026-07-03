import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfessionalCardInfo } from "@/components/custom/doctor/ProfessionalCardInfo";

const baseDoctor = {
	id: "d-1",
	name: "Dr. Test",
	rating: 4.5,
	consultationCount: 10,
	phone: "+55 11 99999-9999",
	email: "doc@test.com",
	licenseNumber: "CRM-12345",
	specialty: "CARDIOLOGY",
	imageUrl: null,
};

describe("ProfessionalCardInfo", () => {
	it("renders rating when provided", () => {
		render(<ProfessionalCardInfo professional={baseDoctor as never} />);
		expect(screen.getByText("4.5")).toBeInTheDocument();
	});

	it("renders consultation count", () => {
		render(<ProfessionalCardInfo professional={baseDoctor as never} />);
		expect(screen.getByText(/10 consulta/)).toBeInTheDocument();
	});

	it("does not render rating row when rating is null", () => {
		const doc = { ...baseDoctor, rating: null };
		render(<ProfessionalCardInfo professional={doc as never} />);
		expect(screen.queryByText("4.5")).not.toBeInTheDocument();
	});

	it("renders phone when provided", () => {
		render(<ProfessionalCardInfo professional={baseDoctor as never} />);
		expect(screen.getByText("+55 11 99999-9999")).toBeInTheDocument();
	});

	it("does not render phone when absent", () => {
		const doc = { ...baseDoctor, phone: null };
		render(<ProfessionalCardInfo professional={doc as never} />);
		expect(screen.queryByText("+55 11 99999-9999")).not.toBeInTheDocument();
	});

	it("renders email when provided", () => {
		render(<ProfessionalCardInfo professional={baseDoctor as never} />);
		expect(screen.getByText("doc@test.com")).toBeInTheDocument();
	});

	it("renders CRM license number with prefix", () => {
		render(<ProfessionalCardInfo professional={baseDoctor as never} />);
		expect(screen.getByText("CRM: CRM-12345")).toBeInTheDocument();
	});

	it("does not render license when absent", () => {
		const doc = { ...baseDoctor, licenseNumber: null };
		render(<ProfessionalCardInfo professional={doc as never} />);
		expect(screen.queryByText(/CRM:/)).not.toBeInTheDocument();
	});
});
