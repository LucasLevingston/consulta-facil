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

import { ProfilePatientMedicalInfo } from "./ProfilePatientMedicalInfo";

describe("ProfilePatientMedicalInfo", () => {
	it("renderiza skeletons quando isLoading é verdadeiro", () => {
		const { container } = render(
			<ProfilePatientMedicalInfo patientProfile={null} isLoading={true} />,
		);
		expect(
			container.querySelectorAll('[class*="animate-pulse"]').length,
		).toBeGreaterThan(0);
	});

	it("renderiza alergias e medicações quando presentes", () => {
		render(
			<ProfilePatientMedicalInfo
				patientProfile={{
					allergies: "Dipirona",
					currentMedication: "Losartana",
					pastMedicalHistory: "Hipertensão",
				}}
				isLoading={false}
			/>,
		);

		expect(screen.getByText("Dipirona")).toBeInTheDocument();
		expect(screen.getByText("Losartana")).toBeInTheDocument();
		expect(screen.getByText("Hipertensão")).toBeInTheDocument();
	});

	it("não exibe mensagem de dados ausentes quando há alergias registradas", () => {
		render(
			<ProfilePatientMedicalInfo
				patientProfile={{ allergies: "Dipirona", currentMedication: null }}
				isLoading={false}
			/>,
		);
		expect(
			screen.queryByText("Nenhuma informação médica registrada"),
		).not.toBeInTheDocument();
	});

	it("exibe mensagem de dados ausentes quando não há alergias nem medicações", () => {
		render(
			<ProfilePatientMedicalInfo
				patientProfile={{ allergies: null, currentMedication: null }}
				isLoading={false}
			/>,
		);
		expect(
			screen.getByText("Nenhuma informação médica registrada"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Adicionar informações").closest("a"),
		).toHaveAttribute("href", "/settings");
	});

	it("exibe mensagem de dados ausentes quando patientProfile é undefined", () => {
		render(
			<ProfilePatientMedicalInfo
				patientProfile={undefined}
				isLoading={false}
			/>,
		);
		expect(
			screen.getByText("Nenhuma informação médica registrada"),
		).toBeInTheDocument();
	});
});
