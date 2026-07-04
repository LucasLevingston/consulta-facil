import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExamListItemSchedulingInfo } from "@/components/exams/ExamListItemSchedulingInfo";
import type { ExamRequestResponse } from "@/features/exams";

// Testes da caixa de informações de agendamento do exame: data/hora,
// nome, endereço e telefone do laboratório.

const baseExam = {
	id: "e-1",
	scheduledAt: "2026-08-10T14:30:00Z",
	labName: "Laboratório Central",
	labAddress: "Rua das Flores, 100",
	labPhone: "(11) 4000-0000",
} as unknown as ExamRequestResponse;

describe("ExamListItemSchedulingInfo", () => {
	it("exibe o nome do laboratório", () => {
		render(<ExamListItemSchedulingInfo exam={baseExam} />);
		expect(screen.getByText("Laboratório Central")).toBeInTheDocument();
	});

	it("exibe o endereço do laboratório quando presente", () => {
		render(<ExamListItemSchedulingInfo exam={baseExam} />);
		expect(screen.getByText("Rua das Flores, 100")).toBeInTheDocument();
	});

	it("não exibe endereço quando labAddress é nulo", () => {
		const exam = { ...baseExam, labAddress: null };
		render(<ExamListItemSchedulingInfo exam={exam} />);
		expect(screen.queryByText("Rua das Flores, 100")).not.toBeInTheDocument();
	});

	it("exibe o telefone do laboratório quando presente", () => {
		render(<ExamListItemSchedulingInfo exam={baseExam} />);
		expect(screen.getByText("(11) 4000-0000")).toBeInTheDocument();
	});

	it("não exibe telefone quando labPhone é nulo", () => {
		const exam = { ...baseExam, labPhone: null };
		render(<ExamListItemSchedulingInfo exam={exam} />);
		expect(screen.queryByText("(11) 4000-0000")).not.toBeInTheDocument();
	});

	it("não exibe data/hora quando scheduledAt é nulo", () => {
		const exam = { ...baseExam, scheduledAt: null };
		const { container } = render(<ExamListItemSchedulingInfo exam={exam} />);
		// título + nome do lab + endereço + telefone, sem o parágrafo de data/hora
		expect(container.querySelectorAll("p").length).toBe(4);
	});

	it("exibe o título 'Agendamento'", () => {
		render(<ExamListItemSchedulingInfo exam={baseExam} />);
		expect(screen.getByText("Agendamento")).toBeInTheDocument();
	});
});
