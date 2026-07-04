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

import { ClinicDetailHeader } from "@/components/clinic/ClinicDetailHeader";
import { ClinicOverviewInfo } from "@/components/clinic/ClinicOverviewInfo";
import { ClinicOverviewStats } from "@/components/clinic/ClinicOverviewStats";
import { ClinicOverviewTab } from "@/components/clinic/ClinicOverviewTab";
import type { ClinicResponse } from "@/features/clinics";

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

describe("ClinicOverviewStats", () => {
	it("renders contagem de profissionais no plural", () => {
		render(
			<ClinicOverviewStats
				memberCount={2}
				specialtyCount={3}
				ownerName="Dr. Dono"
			/>,
		);
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("profissionalis cadastrados")).toBeInTheDocument();
	});

	it("renders contagem de profissionais no singular", () => {
		render(
			<ClinicOverviewStats
				memberCount={1}
				specialtyCount={1}
				ownerName="Dr. Dono"
			/>,
		);
		expect(screen.getByText("profissional cadastrado")).toBeInTheDocument();
	});

	it("renders nome do proprietário", () => {
		render(
			<ClinicOverviewStats
				memberCount={1}
				specialtyCount={1}
				ownerName="Dr. Dono"
			/>,
		);
		expect(screen.getByText("Dr. Dono")).toBeInTheDocument();
	});

	it("usa fallback '—' quando ownerName é nulo", () => {
		render(
			<ClinicOverviewStats
				memberCount={0}
				specialtyCount={0}
				ownerName={null}
			/>,
		);
		expect(screen.getByText("—")).toBeInTheDocument();
	});
});

describe("ClinicOverviewInfo", () => {
	it("renders descrição quando presente", () => {
		render(
			<ClinicOverviewInfo
				clinic={{ ...clinic, description: "Clínica top." }}
				specialties={[]}
			/>,
		);
		expect(screen.getByText("Clínica top.")).toBeInTheDocument();
	});

	it("renders endereço quando presente", () => {
		render(
			<ClinicOverviewInfo
				clinic={{ ...clinic, address: "Rua das Flores, 100" }}
				specialties={[]}
			/>,
		);
		expect(screen.getByText("Rua das Flores, 100")).toBeInTheDocument();
	});

	it("renders telefone quando presente", () => {
		render(<ClinicOverviewInfo clinic={clinic} specialties={[]} />);
		expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
	});

	it("renders badges de especialidades quando houver", () => {
		render(
			<ClinicOverviewInfo
				clinic={clinic}
				specialties={["Cardiologia", "Ortopedia"]}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
		expect(screen.getByText("Ortopedia")).toBeInTheDocument();
	});

	it("não renders seção de especialidades quando lista vazia", () => {
		render(<ClinicOverviewInfo clinic={clinic} specialties={[]} />);
		expect(
			screen.queryByText("Especialidades disponíveis"),
		).not.toBeInTheDocument();
	});
});

describe("ClinicOverviewTab", () => {
	it("renders stats e informações da clínica", () => {
		render(<ClinicOverviewTab clinic={clinic} />);
		expect(screen.getByText("Dr. Dono")).toBeInTheDocument();
		expect(screen.getAllByText("2")).toHaveLength(2);
		expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
	});

	it("deriva especialidades únicas dos membros", () => {
		render(<ClinicOverviewTab clinic={clinic} />);
		expect(screen.getByText("CARDIOLOGIA")).toBeInTheDocument();
		expect(screen.getByText("ORTOPEDIA")).toBeInTheDocument();
	});

	it("renders zero profissionais quando não há membros", () => {
		render(
			<ClinicOverviewTab
				clinic={{ ...clinic, members: [] } as unknown as ClinicResponse}
			/>,
		);
		expect(screen.getAllByText("0")).toHaveLength(2);
	});
});
