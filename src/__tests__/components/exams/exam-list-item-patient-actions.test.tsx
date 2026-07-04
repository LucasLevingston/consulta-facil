import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ExamListItemPatientActions } from "@/components/exams/ExamListItemPatientActions";
import type { ExamRequestResponse } from "@/features/exams";

// Testes das ações do paciente no item de exame: escolher laboratório
// (status PENDING), cancelar agendamento (status SCHEDULED) e enviar resultado.

const baseExam = {
	id: "e-1",
	status: "PENDING",
	schedulingId: null,
} as unknown as ExamRequestResponse;

function renderActions(overrides: Partial<ExamRequestResponse> = {}) {
	const fileInputRef = createRef<HTMLInputElement>();
	const onCancelScheduling = vi.fn();
	const onUpload = vi.fn();
	const utils = render(
		<ExamListItemPatientActions
			exam={{ ...baseExam, ...overrides } as ExamRequestResponse}
			cancelling={false}
			uploading={false}
			fileInputRef={fileInputRef}
			onCancelScheduling={onCancelScheduling}
			onUpload={onUpload}
		/>,
	);
	return { ...utils, onCancelScheduling, onUpload };
}

describe("ExamListItemPatientActions", () => {
	it("exibe o botão 'Escolher laboratório' quando status é PENDING", () => {
		renderActions({ status: "PENDING" });
		expect(screen.getByText("Escolher laboratório")).toBeInTheDocument();
	});

	it("não exibe o botão 'Escolher laboratório' quando status não é PENDING", () => {
		renderActions({ status: "SCHEDULED" });
		expect(screen.queryByText("Escolher laboratório")).not.toBeInTheDocument();
	});

	it("exibe o botão 'Cancelar agendamento' quando status é SCHEDULED e há schedulingId", () => {
		renderActions({ status: "SCHEDULED", schedulingId: "s-1" });
		expect(screen.getByText("Cancelar agendamento")).toBeInTheDocument();
	});

	it("não exibe o botão 'Cancelar agendamento' quando não há schedulingId", () => {
		renderActions({ status: "SCHEDULED", schedulingId: null });
		expect(screen.queryByText("Cancelar agendamento")).not.toBeInTheDocument();
	});

	it("chama onCancelScheduling ao clicar em 'Cancelar agendamento'", async () => {
		const { onCancelScheduling } = renderActions({
			status: "SCHEDULED",
			schedulingId: "s-1",
		});
		await userEvent.click(screen.getByText("Cancelar agendamento"));
		expect(onCancelScheduling).toHaveBeenCalledTimes(1);
	});

	it("exibe 'Cancelando...' quando cancelling=true", () => {
		const fileInputRef = createRef<HTMLInputElement>();
		render(
			<ExamListItemPatientActions
				exam={{ ...baseExam, status: "SCHEDULED", schedulingId: "s-1" }}
				cancelling={true}
				uploading={false}
				fileInputRef={fileInputRef}
				onCancelScheduling={vi.fn()}
				onUpload={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cancelando...")).toBeInTheDocument();
	});

	it("sempre exibe o botão de enviar resultado", () => {
		renderActions();
		expect(screen.getByText("Enviar resultado")).toBeInTheDocument();
	});

	it("exibe 'Enviando...' quando uploading=true", () => {
		const fileInputRef = createRef<HTMLInputElement>();
		render(
			<ExamListItemPatientActions
				exam={baseExam}
				cancelling={false}
				uploading={true}
				fileInputRef={fileInputRef}
				onCancelScheduling={vi.fn()}
				onUpload={vi.fn()}
			/>,
		);
		expect(screen.getByText("Enviando...")).toBeInTheDocument();
	});
});
