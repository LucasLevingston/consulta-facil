import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

// Testes do componente composto ExamListItem: orquestra header, link de arquivo,
// observações do profissional, informações de agendamento, ações do paciente
// e seção de revisão, de acordo com isPatient/isProfessional e status do exame.

vi.mock("@/components/exams/useExamListItem", () => ({
	useExamListItem: vi.fn(),
}));

import { ExamListItem } from "@/components/exams/ExamListItem";
import { useExamListItem } from "@/components/exams/useExamListItem";
import type { ExamRequestResponse } from "@/features/exams";

const mockUseExamListItem = vi.mocked(useExamListItem);

function defaultHandlers() {
	return {
		fileInputRef: createRef<HTMLInputElement>(),
		uploading: false,
		reviewNotes: "",
		setReviewNotes: vi.fn(),
		reviewing: false,
		showReviewForm: false,
		setShowReviewForm: vi.fn(),
		cancelling: false,
		handleUpload: vi.fn(),
		handleCancelScheduling: vi.fn(),
		handleReview: vi.fn(),
	} as never;
}

const baseExam = {
	id: "e-1",
	examName: "HEMOGRAMA_COMPLETO",
	professionalName: "Dr. João",
	patientName: "Maria Silva",
	instructions: null,
	status: "PENDING",
	fileUrl: null,
	fileName: null,
	professionalNotes: null,
	schedulingId: null,
	labName: null,
} as unknown as ExamRequestResponse;

describe("ExamListItem", () => {
	it("renderiza o nome do profissional quando isPatient=true", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		render(
			<ExamListItem exam={baseExam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
	});

	it("renderiza o nome do paciente quando isPatient=false", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		render(
			<ExamListItem exam={baseExam} isPatient={false} isProfessional={true} />,
		);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
	});

	it("exibe o link para o arquivo quando fileUrl está presente", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = {
			...baseExam,
			fileUrl: "http://x.com/f.pdf",
			fileName: "f.pdf",
		};
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("f.pdf")).toBeInTheDocument();
	});

	it("não exibe link de arquivo quando fileUrl é nulo", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		render(
			<ExamListItem exam={baseExam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.queryByText("Ver arquivo")).not.toBeInTheDocument();
		expect(
			document.querySelector(`a[href="${baseExam.fileUrl}"]`),
		).not.toBeInTheDocument();
	});

	it("exibe as observações do profissional quando presentes", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = { ...baseExam, professionalNotes: "Resultado normal" };
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Resultado normal")).toBeInTheDocument();
	});

	it("exibe informações de agendamento quando isPatient, status SCHEDULED e labName presentes", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = {
			...baseExam,
			status: "SCHEDULED",
			labName: "Laboratório Central",
		};
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Laboratório Central")).toBeInTheDocument();
	});

	it("não exibe informações de agendamento quando isPatient=false", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = {
			...baseExam,
			status: "SCHEDULED",
			labName: "Laboratório Central",
		};
		render(
			<ExamListItem exam={exam} isPatient={false} isProfessional={true} />,
		);
		expect(screen.queryByText("Laboratório Central")).not.toBeInTheDocument();
	});

	it("exibe ações do paciente quando isPatient e status PENDING", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		render(
			<ExamListItem exam={baseExam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Escolher laboratório")).toBeInTheDocument();
		expect(screen.getByText("Enviar resultado")).toBeInTheDocument();
	});

	it("não exibe ações do paciente quando status é UPLOADED", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = { ...baseExam, status: "UPLOADED" };
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.queryByText("Enviar resultado")).not.toBeInTheDocument();
	});

	it("exibe a seção de revisão quando isProfessional e status UPLOADED", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = { ...baseExam, status: "UPLOADED" };
		render(
			<ExamListItem exam={exam} isPatient={false} isProfessional={true} />,
		);
		expect(screen.getByText("Adicionar observações")).toBeInTheDocument();
	});

	it("não exibe a seção de revisão quando isProfessional=false", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = { ...baseExam, status: "UPLOADED" };
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.queryByText("Adicionar observações")).not.toBeInTheDocument();
	});

	it("exibe badge de status 'Pendente' para status PENDING", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		render(
			<ExamListItem exam={baseExam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("exibe badge de status 'Analisado' para status REVIEWED", () => {
		mockUseExamListItem.mockReturnValue(defaultHandlers());
		const exam = { ...baseExam, status: "REVIEWED" };
		render(
			<ExamListItem exam={exam} isPatient={true} isProfessional={false} />,
		);
		expect(screen.getByText("Analisado")).toBeInTheDocument();
	});
});
