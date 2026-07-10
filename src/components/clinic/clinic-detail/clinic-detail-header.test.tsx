import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));

import type { ClinicResponse } from "@/features/clinics";
import { ClinicDetailHeader } from "./ClinicDetailHeader";

const clinic = {
	id: "c-1",
	name: "Clínica Saúde",
	city: "São Paulo",
	state: "SP",
	phone: "(11) 9999-9999",
	status: "ACTIVE",
	ownerId: "owner-1",
	ownerName: "Dr. Dono",
	members: [
		{
			professionalProfileId: "prof-1",
			professionalName: "Dr. João",
			specialty: "CARDIOLOGIA",
			role: "OWNER",
		},
		{
			professionalProfileId: "prof-2",
			professionalName: "Dra. Ana",
			specialty: "ORTOPEDIA",
			role: "MEMBER",
		},
	],
} as unknown as ClinicResponse;

describe("ClinicDetailHeader", () => {
	it("renders nome da clínica", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("Clínica Saúde")).toBeInTheDocument();
	});

	it("renders cidade e estado", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
	});

	it("renders telefone", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
	});

	it("renders link para a fila de espera", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("Fila de Espera").closest("a")).toHaveAttribute(
			"href",
			"/clinics/c-1/queue",
		);
	});

	it("renders status Ativa quando clinic.status=ACTIVE", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("Ativa")).toBeInTheDocument();
	});

	it("renders badge Proprietário quando isOwner=true", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={true}
				isAdmin={false}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("Proprietário")).toBeInTheDocument();
	});

	it("renders badge Admin quando isAdmin=true e não é dono", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={true}
				hasMembership={false}
			/>,
		);
		expect(screen.getByText("Admin")).toBeInTheDocument();
	});

	it("renders badge Membro quando hasMembership=true e não é dono", () => {
		render(
			<ClinicDetailHeader
				clinic={clinic}
				clinicId="c-1"
				isOwner={false}
				isAdmin={false}
				hasMembership={true}
			/>,
		);
		expect(screen.getByText("Membro")).toBeInTheDocument();
	});
});
