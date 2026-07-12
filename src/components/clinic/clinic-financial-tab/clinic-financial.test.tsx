import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseClinicFinancialStats = vi.fn();
vi.mock("./use-clinic-financial-stats", () => ({
	useClinicFinancialStats: (members: unknown[]) =>
		mockUseClinicFinancialStats(members),
}));

import type { ClinicResponse } from "@/features/clinics";
import { ClinicFinancialSummaryCards } from "./ClinicFinancialSummaryCards";
import { ClinicFinancialTab } from "./ClinicFinancialTab";
import { ClinicMemberRow } from "./ClinicMemberRow";
import { ClinicMemberUsageCard } from "./ClinicMemberUsageCard";

type Member = NonNullable<ClinicResponse["members"]>[number];

const member: Member = {
	professionalProfileId: "prof-1",
	professionalName: "Dr. João",
	specialty: "CARDIOLOGIA",
	imageUrl: null,
	role: "OWNER",
};

describe("ClinicFinancialSummaryCards", () => {
	it("renders total de consultas concluídas", () => {
		render(
			<ClinicFinancialSummaryCards
				totalCompleted={12}
				totalFreeUsed={8}
				totalFreeQuota={10}
				extraProfessionals={0}
			/>,
		);
		expect(screen.getByText("12")).toBeInTheDocument();
	});

	it("renders cota gratuita usada/total", () => {
		render(
			<ClinicFinancialSummaryCards
				totalCompleted={12}
				totalFreeUsed={8}
				totalFreeQuota={10}
				extraProfessionals={0}
			/>,
		);
		expect(screen.getByText("8")).toBeInTheDocument();
		expect(screen.getByText("/10")).toBeInTheDocument();
		expect(screen.getByText("2 restantes")).toBeInTheDocument();
	});

	it("mostra 'dentro do limite gratuito' quando não há extras", () => {
		render(
			<ClinicFinancialSummaryCards
				totalCompleted={0}
				totalFreeUsed={0}
				totalFreeQuota={0}
				extraProfessionals={0}
			/>,
		);
		expect(screen.getByText("dentro do limite gratuito")).toBeInTheDocument();
	});

	it("mostra percentual extra quando há profissionais extras", () => {
		render(
			<ClinicFinancialSummaryCards
				totalCompleted={0}
				totalFreeUsed={0}
				totalFreeQuota={0}
				extraProfessionals={2}
			/>,
		);
		expect(screen.getByText("+40% no plano")).toBeInTheDocument();
	});
});

describe("ClinicMemberRow", () => {
	it("renders nome do profissional e especialidade", () => {
		render(
			<ClinicMemberRow
				member={member}
				completed={5}
				freeUsed={5}
				paidCount={0}
			/>,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renders contagem de consultas grátis usadas", () => {
		render(
			<ClinicMemberRow
				member={member}
				completed={5}
				freeUsed={3}
				paidCount={0}
			/>,
		);
		expect(screen.getByText("3/5 grátis")).toBeInTheDocument();
	});

	it("renders badge de consultas pagas quando paidCount > 0", () => {
		render(
			<ClinicMemberRow
				member={member}
				completed={8}
				freeUsed={5}
				paidCount={3}
			/>,
		);
		expect(screen.getByText("+3 pagas")).toBeInTheDocument();
	});

	it("não renders badge de pagas quando paidCount é 0", () => {
		render(
			<ClinicMemberRow
				member={member}
				completed={5}
				freeUsed={5}
				paidCount={0}
			/>,
		);
		expect(screen.queryByText(/pagas/)).not.toBeInTheDocument();
	});

	it("mostra mensagem quando não há consultas realizadas", () => {
		render(
			<ClinicMemberRow
				member={member}
				completed={0}
				freeUsed={0}
				paidCount={0}
			/>,
		);
		expect(screen.getByText("Nenhuma consulta realizada")).toBeInTheDocument();
	});
});

describe("ClinicMemberUsageCard", () => {
	const memberStats = [{ member, completed: 5, freeUsed: 5, paidCount: 0 }];

	it("renders título do card", () => {
		render(
			<ClinicMemberUsageCard
				memberStats={memberStats}
				membersCount={1}
				totalFreeQuota={5}
				totalPaid={0}
				extraProfessionals={0}
			/>,
		);
		expect(screen.getByText("Uso por profissional")).toBeInTheDocument();
	});

	it("renders uma linha por membro", () => {
		render(
			<ClinicMemberUsageCard
				memberStats={memberStats}
				membersCount={1}
				totalFreeQuota={5}
				totalPaid={0}
				extraProfessionals={0}
			/>,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
	});

	it("renders resumo do modelo de pagamento", () => {
		render(
			<ClinicMemberUsageCard
				memberStats={memberStats}
				membersCount={1}
				totalFreeQuota={5}
				totalPaid={2}
				extraProfessionals={0}
			/>,
		);
		expect(
			screen.getByText("Resumo do modelo de pagamento"),
		).toBeInTheDocument();
		expect(screen.getByText(/2 consultas além da cota/)).toBeInTheDocument();
	});

	it("renders aviso de profissionais extras quando houver", () => {
		render(
			<ClinicMemberUsageCard
				memberStats={memberStats}
				membersCount={6}
				totalFreeQuota={30}
				totalPaid={0}
				extraProfessionals={1}
			/>,
		);
		expect(screen.getByText(/1 profissional extra/)).toBeInTheDocument();
	});
});

describe("ClinicFinancialTab", () => {
	const clinic = {
		id: "c-1",
		members: [member],
	} as unknown as ClinicResponse;

	it("renders spinner de loading enquanto carrega", () => {
		mockUseClinicFinancialStats.mockReturnValue({
			isLoading: true,
			memberStats: [],
			totalCompleted: 0,
			totalFreeUsed: 0,
			totalFreeQuota: 0,
			totalPaid: 0,
			extraProfessionals: 0,
		});
		const { container } = render(<ClinicFinancialTab clinic={clinic} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders cards de resumo e uso quando carregado", () => {
		mockUseClinicFinancialStats.mockReturnValue({
			isLoading: false,
			memberStats: [{ member, completed: 5, freeUsed: 5, paidCount: 0 }],
			totalCompleted: 5,
			totalFreeUsed: 5,
			totalFreeQuota: 5,
			totalPaid: 0,
			extraProfessionals: 0,
		});
		render(<ClinicFinancialTab clinic={clinic} />);
		expect(screen.getByText("Consultas realizadas")).toBeInTheDocument();
		expect(screen.getByText("Uso por profissional")).toBeInTheDocument();
	});
});
