import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

import ProfessionalCard from "@/components/custom/professional/ProfessionalCard";

const professional: ProfessionalResponse = {
	id: "d-1",
	userId: "u-1",
	name: "Dra. Ana Silva",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	email: "ana@email.com",
	phone: "+5511999999999",
	rating: 4.8,
	consultationCount: 120,
	imageUrl: null,
	profession: "Médico",
	consultationPrice: 250,
	acceptedPaymentMethods: [],
	paymentTiming: null,
	city: "São Paulo",
	state: "SP",
	latitude: null,
	longitude: null,
	bio: null,
	status: "APPROVED",
	createdAt: "2026-01-01",
} as unknown as ProfessionalResponse;

describe("ProfessionalCard", () => {
	it("renders professional name", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
	});

	it("renders specialty badge", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renders rating when provided", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText("4.8")).toBeInTheDocument();
	});

	it("renders CRM license number", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText(/CRM: CRM-12345/)).toBeInTheDocument();
	});

	it("renders appointment button by default", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("hides appointment button when isActiveAppointmentButton=false", () => {
		render(
			<ProfessionalCard
				professional={professional}
				isActiveAppointmentButton={false}
			/>,
		);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("renders fallback initials when no image", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText("DA")).toBeInTheDocument();
	});

	it("renders email when provided", () => {
		render(<ProfessionalCard professional={professional} />);
		expect(screen.getByText("ana@email.com")).toBeInTheDocument();
	});
});
