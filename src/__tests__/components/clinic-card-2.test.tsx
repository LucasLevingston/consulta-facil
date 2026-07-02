import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
	default: ({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) => (
		// biome-ignore lint/performance/noImgElement: mock
		<img src={src} alt={alt} {...props} />
	),
}));
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));

import ClinicCard from "@/components/custom/clinic/ClinicCard";

const baseClinic = {
	id: "c-1",
	name: "Clínica Saúde",
	city: "São Paulo",
	state: "SP",
	description: "Clínica especializada.",
	address: "Rua das Flores, 100",
	phone: "(11) 9999-9999",
	imageUrl: null,
	members: [],
};

describe("ClinicCard extended", () => {
	it("renders member specialties as badges", () => {
		const clinicWithMembers = {
			...baseClinic,
			members: [{ professionalProfileId: "p-1", specialty: "Cardiologia" }],
		};
		render(<ClinicCard clinic={clinicWithMembers as never} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("shows +N badge when more than 3 members", () => {
		const clinicWithMembers = {
			...baseClinic,
			members: [
				{ professionalProfileId: "p-1", specialty: "Cardiologia" },
				{ professionalProfileId: "p-2", specialty: "Ortopedia" },
				{ professionalProfileId: "p-3", specialty: "Neurologia" },
				{ professionalProfileId: "p-4", specialty: "Psiquiatria" },
			],
		};
		render(<ClinicCard clinic={clinicWithMembers as never} />);
		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("does not show member count when members empty", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.queryByText(/profissional/)).not.toBeInTheDocument();
	});

	it("renders 'Ver clínica' link", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/clinics/c-1");
	});

	it("renders singular profissional for 1 member", () => {
		const clinicWithMembers = {
			...baseClinic,
			members: [{ professionalProfileId: "p-1", specialty: "Cardiologia" }],
		};
		render(<ClinicCard clinic={clinicWithMembers as never} />);
		expect(screen.getByText("1 profissional")).toBeInTheDocument();
	});

	it("renders city without state when state absent", () => {
		const clinicNoState = { ...baseClinic, state: null };
		render(<ClinicCard clinic={clinicNoState as never} />);
		expect(screen.getByText("São Paulo")).toBeInTheDocument();
	});
});
