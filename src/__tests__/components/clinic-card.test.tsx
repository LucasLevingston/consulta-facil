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

describe("ClinicCard", () => {
	it("renders clinic name", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.getByText("Clínica Saúde")).toBeInTheDocument();
	});

	it("renders city and state", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
	});

	it("renders description when provided", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.getByText("Clínica especializada.")).toBeInTheDocument();
	});

	it("renders address when provided", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.getByText("Rua das Flores, 100")).toBeInTheDocument();
	});

	it("renders phone when provided", () => {
		render(<ClinicCard clinic={baseClinic as never} />);
		expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
	});

	it("renders image when imageUrl provided", () => {
		const clinicWithImage = {
			...baseClinic,
			imageUrl: "https://img.example.com/clinic.jpg",
		};
		render(<ClinicCard clinic={clinicWithImage as never} />);
		expect(screen.getByAltText("Clínica Saúde")).toBeInTheDocument();
	});

	it("shows building icon when no imageUrl", () => {
		const { container } = render(<ClinicCard clinic={baseClinic as never} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders member count when members exist", () => {
		const clinicWithMembers = {
			...baseClinic,
			members: [
				{ professionalProfileId: "p-1", specialty: "Cardiologia" },
				{ professionalProfileId: "p-2", specialty: "Ortopedia" },
			],
		};
		render(<ClinicCard clinic={clinicWithMembers as never} />);
		expect(screen.getByText(/2 profissionais/)).toBeInTheDocument();
	});
});
