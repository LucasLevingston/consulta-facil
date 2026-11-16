import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserRoleCard } from "./UserRoleCard";

function user(overrides: Record<string, unknown> = {}) {
	return {
		id: "u1",
		name: "Ana Souza",
		email: "ana@example.com",
		role: "PROFESSIONAL",
		createdAt: "2026-03-15T10:00:00",
		...overrides,
	} as never;
}

describe("UserRoleCard", () => {
	it("shows name, email, translated role and sign-up date", () => {
		render(<UserRoleCard user={user()} />);

		expect(screen.getByText("Ana Souza")).toBeInTheDocument();
		expect(screen.getByText("ana@example.com")).toBeInTheDocument();
		expect(screen.getByText("Profissional")).toBeInTheDocument();
		expect(screen.getByText("Cadastro: 15/03/2026")).toBeInTheDocument();
	});

	it.each([
		["PATIENT", "Paciente"],
		["ADMIN", "Admin"],
		["RECEPTIONIST", "Recepcionista"],
		["AUDITOR", "AUDITOR"],
	])("labels role %s as %s", (role, label) => {
		render(<UserRoleCard user={user({ role })} />);

		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it("uses dashes for missing name/email and hides absent role and date", () => {
		render(
			<UserRoleCard
				user={user({ name: null, email: null, role: null, createdAt: null })}
			/>,
		);

		expect(screen.getAllByText("—")).toHaveLength(2);
		expect(screen.queryByText(/Cadastro:/)).not.toBeInTheDocument();
	});
});
