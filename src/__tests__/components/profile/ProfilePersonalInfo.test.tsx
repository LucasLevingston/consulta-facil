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

import { ProfilePersonalInfo } from "@/components/profile/ProfilePersonalInfo";
import type { UserResponse } from "@/features/auth";

const baseUser: UserResponse = {
	id: "u-1",
	name: "Carlos Souza",
	email: "carlos@teste.com",
	role: "PATIENT",
};

describe("ProfilePersonalInfo", () => {
	it("sempre renderiza o e-mail do usuário", () => {
		render(<ProfilePersonalInfo user={baseUser} />);
		expect(screen.getByText("carlos@teste.com")).toBeInTheDocument();
	});

	it("renderiza telefone, CPF, data de nascimento e gênero quando presentes", () => {
		render(
			<ProfilePersonalInfo
				user={{
					...baseUser,
					phone: "(11) 98888-7777",
					cpf: "123.456.789-00",
					birthDate: "1990-05-20T00:00:00.000Z",
					gender: "MALE",
				}}
			/>,
		);

		expect(screen.getByText("(11) 98888-7777")).toBeInTheDocument();
		expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
		expect(screen.getByText("Masculino")).toBeInTheDocument();
		expect(screen.getByText(/maio de 1990/)).toBeInTheDocument();
	});

	it("não exibe telefone, CPF, data de nascimento ou gênero quando ausentes (dados sensíveis)", () => {
		render(<ProfilePersonalInfo user={baseUser} />);

		expect(screen.queryByText("Telefone")).not.toBeInTheDocument();
		expect(screen.queryByText("CPF")).not.toBeInTheDocument();
		expect(screen.queryByText("Data de nascimento")).not.toBeInTheDocument();
		expect(screen.queryByText("Gênero")).not.toBeInTheDocument();
	});

	it("exibe mensagem de perfil incompleto quando não há dados complementares", () => {
		render(<ProfilePersonalInfo user={baseUser} />);
		expect(screen.getByText("Perfil incompleto")).toBeInTheDocument();
		expect(screen.getByText("Completar perfil").closest("a")).toHaveAttribute(
			"href",
			"/settings",
		);
	});

	it("não exibe mensagem de perfil incompleto quando há ao menos um dado complementar", () => {
		render(
			<ProfilePersonalInfo user={{ ...baseUser, phone: "11999999999" }} />,
		);
		expect(screen.queryByText("Perfil incompleto")).not.toBeInTheDocument();
	});
});
