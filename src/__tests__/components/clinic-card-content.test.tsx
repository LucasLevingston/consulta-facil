import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/clinics", () => ({}));
vi.mock("@/utils/constants/profession-specialties", () => ({
	SPECIALTY_LABELS: { CARDIOLOGY: "Cardiologia", ORTHOPEDICS: "Ortopedia" },
}));

import { ClinicCardContent } from "@/components/custom/clinic/ClinicCardContent";

const baseClinic = {
	id: "c-1",
	name: "Clínica Test",
	description: null,
	address: null,
	phone: null,
	members: [],
};

describe("ClinicCardContent", () => {
	it("renders description when provided", () => {
		const clinic = { ...baseClinic, description: "Clínica especializada." };
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("Clínica especializada.")).toBeInTheDocument();
	});

	it("renders address when provided", () => {
		const clinic = { ...baseClinic, address: "Rua das Flores, 100" };
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("Rua das Flores, 100")).toBeInTheDocument();
	});

	it("renders phone when provided", () => {
		const clinic = { ...baseClinic, phone: "(11) 9999-9999" };
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
	});

	it("renders member count in plural", () => {
		const clinic = {
			...baseClinic,
			members: [
				{ professionalProfileId: "p-1", specialty: "CARDIOLOGY" },
				{ professionalProfileId: "p-2", specialty: "ORTHOPEDICS" },
			],
		};
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("2 profissionais")).toBeInTheDocument();
	});

	it("renders member count in singular", () => {
		const clinic = {
			...baseClinic,
			members: [{ professionalProfileId: "p-1", specialty: "CARDIOLOGY" }],
		};
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("1 profissional")).toBeInTheDocument();
	});

	it("renders specialty badge", () => {
		const clinic = {
			...baseClinic,
			members: [{ professionalProfileId: "p-1", specialty: "CARDIOLOGY" }],
		};
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renders +N badge when more than 3 members", () => {
		const clinic = {
			...baseClinic,
			members: [
				{ professionalProfileId: "p-1", specialty: "CARDIOLOGY" },
				{ professionalProfileId: "p-2", specialty: "ORTHOPEDICS" },
				{ professionalProfileId: "p-3", specialty: "CARDIOLOGY" },
				{ professionalProfileId: "p-4", specialty: "ORTHOPEDICS" },
			],
		};
		render(<ClinicCardContent clinic={clinic as never} />);
		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("does not render member count when empty", () => {
		render(<ClinicCardContent clinic={baseClinic as never} />);
		expect(screen.queryByText(/profissional/)).not.toBeInTheDocument();
	});
});
