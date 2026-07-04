import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExamListItemHeader } from "@/components/exams/ExamListItemHeader";
import type { ExamRequestResponse } from "@/features/exams";

// Testes do cabeçalho do item de exame: exibição do nome do exame,
// do nome do outro participante (paciente/profissional), instruções e badge de status.

const baseExam = {
	id: "e-1",
	examName: "HEMOGRAMA_COMPLETO",
	professionalName: "Dr. João",
	patientName: "Maria Silva",
	instructions: null,
	status: "PENDING",
} as unknown as ExamRequestResponse;

describe("ExamListItemHeader", () => {
	it("exibe o label traduzido do exame", () => {
		render(
			<ExamListItemHeader
				exam={baseExam}
				isPatient={true}
				statusVariant="secondary"
				statusLabel="Pendente"
			/>,
		);
		expect(screen.getByText("Hemograma Completo")).toBeInTheDocument();
	});

	it("exibe o nome cru do exame quando não há label conhecido", () => {
		const exam = { ...baseExam, examName: "EXAME_DESCONHECIDO" };
		render(
			<ExamListItemHeader
				exam={exam}
				isPatient={true}
				statusVariant="secondary"
				statusLabel="Pendente"
			/>,
		);
		expect(screen.getByText("EXAME_DESCONHECIDO")).toBeInTheDocument();
	});

	it("exibe o nome do profissional quando isPatient=true", () => {
		render(
			<ExamListItemHeader
				exam={baseExam}
				isPatient={true}
				statusVariant="secondary"
				statusLabel="Pendente"
			/>,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
	});

	it("exibe o nome do paciente quando isPatient=false", () => {
		render(
			<ExamListItemHeader
				exam={baseExam}
				isPatient={false}
				statusVariant="secondary"
				statusLabel="Pendente"
			/>,
		);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
	});

	it("exibe as instruções quando presentes", () => {
		const exam = { ...baseExam, instructions: "Jejum de 12 horas" };
		render(
			<ExamListItemHeader
				exam={exam}
				isPatient={true}
				statusVariant="secondary"
				statusLabel="Pendente"
			/>,
		);
		expect(screen.getByText("Jejum de 12 horas")).toBeInTheDocument();
	});

	it("exibe o label de status recebido via props", () => {
		render(
			<ExamListItemHeader
				exam={baseExam}
				isPatient={true}
				statusVariant="default"
				statusLabel="Agendado"
			/>,
		);
		expect(screen.getByText("Agendado")).toBeInTheDocument();
	});
});
