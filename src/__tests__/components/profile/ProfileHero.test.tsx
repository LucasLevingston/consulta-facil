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

vi.mock("@/components/custom/avatar-upload", () => ({
	AvatarUpload: () => <div data-testid="avatar-upload" />,
}));

import { ProfileHero } from "@/components/profile/ProfileHero";
import type { UserResponse } from "@/features/auth";

const baseUser: UserResponse = {
	id: "u-1",
	name: "Maria Silva",
	email: "maria@teste.com",
	role: "PATIENT",
};

describe("ProfileHero", () => {
	it("renderiza nome e e-mail do usuário", () => {
		render(<ProfileHero user={baseUser} isProfessional={false} />);

		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
		expect(screen.getByText("maria@teste.com")).toBeInTheDocument();
	});

	it("renderiza o avatar upload", () => {
		render(<ProfileHero user={baseUser} isProfessional={false} />);
		expect(screen.getByTestId("avatar-upload")).toBeInTheDocument();
	});

	it("exibe o badge 'Paciente' quando isProfessional é falso", () => {
		render(<ProfileHero user={baseUser} isProfessional={false} />);
		expect(screen.getByText("Paciente")).toBeInTheDocument();
	});

	it("exibe o badge 'Profissional' quando isProfessional é verdadeiro", () => {
		render(
			<ProfileHero
				user={{ ...baseUser, role: "PROFESSIONAL" }}
				isProfessional={true}
				professionalData={{ specialty: "CARDIOLOGIA", licenseNumber: "12345" }}
			/>,
		);
		expect(screen.getByText("Profissional")).toBeInTheDocument();
	});

	it("exibe especialidade e CRM quando é profissional com dados profissionais", () => {
		render(
			<ProfileHero
				user={{ ...baseUser, role: "PROFESSIONAL" }}
				isProfessional={true}
				professionalData={{ specialty: "CARDIOLOGIA", licenseNumber: "12345" }}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
		expect(screen.getByText("CRM 12345")).toBeInTheDocument();
	});

	it("não exibe especialidade quando é profissional sem professionalData", () => {
		render(
			<ProfileHero
				user={{ ...baseUser, role: "PROFESSIONAL" }}
				isProfessional={true}
				professionalData={null}
			/>,
		);
		expect(screen.queryByText(/CRM/)).not.toBeInTheDocument();
	});

	it("renderiza os links de editar perfil e configurações", () => {
		render(<ProfileHero user={baseUser} isProfessional={false} />);
		expect(screen.getByText("Editar perfil").closest("a")).toHaveAttribute(
			"href",
			"/settings",
		);
		expect(screen.getByText("Configurações").closest("a")).toHaveAttribute(
			"href",
			"/settings",
		);
	});
});
