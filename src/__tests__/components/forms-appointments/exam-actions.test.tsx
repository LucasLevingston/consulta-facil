import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: () => async (values: unknown) => ({ errors: {}, values }),
}));

vi.mock("@/features/exams", () => ({
	useReviewExam: vi.fn(),
	useUploadExamResult: vi.fn(),
	useCreateExamRequest: vi.fn(),
	createExamRequestSchema: {},
}));

vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	default: ({
		form,
		name,
		label,
		placeholder,
		fieldType,
	}: {
		form: {
			register: (name: string) => Record<string, unknown>;
			setValue: (name: string, value: unknown) => void;
		};
		name: string;
		label?: string;
		placeholder?: string;
		fieldType: string;
	}) => {
		if (fieldType === "SELECT") {
			return (
				<button
					type="button"
					onClick={() => form.setValue(name, "HEMOGRAMA_COMPLETO")}
				>
					{label ?? name}
				</button>
			);
		}
		return (
			<div>
				{label && <label htmlFor={name}>{label}</label>}
				<textarea
					id={name}
					placeholder={placeholder}
					{...form.register(name)}
				/>
			</div>
		);
	},
	FormFieldType: {
		INPUT: "INPUT",
		EMAIL: "EMAIL",
		PASSWORD: "PASSWORD",
		TEXTAREA: "TEXTAREA",
		SELECT: "SELECT",
		DATE_PICKER: "DATE_PICKER",
		CHECKBOX: "CHECKBOX",
	},
}));

import { toast } from "sonner";
import { ExamReviewForm } from "@/components/forms/Appointments/ExamReviewForm";
import { ExamUploadButton } from "@/components/forms/Appointments/ExamUploadButton";
import { RequestExamForm } from "@/components/forms/Appointments/RequestExamForm";
import {
	useCreateExamRequest,
	useReviewExam,
	useUploadExamResult,
} from "@/features/exams";

const mockUseReviewExam = vi.mocked(useReviewExam);
const mockUseUploadExamResult = vi.mocked(useUploadExamResult);
const mockUseCreateExamRequest = vi.mocked(useCreateExamRequest);

describe("ExamReviewForm", () => {
	it("mostra apenas o botão de adicionar observações inicialmente", () => {
		mockUseReviewExam.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<ExamReviewForm examId="exam-1" />);

		expect(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		).toBeInTheDocument();
		expect(
			screen.queryByPlaceholderText(/Descreva suas observações/),
		).not.toBeInTheDocument();
	});

	it("abre o textarea de observações ao clicar no botão", async () => {
		const user = userEvent.setup();
		mockUseReviewExam.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<ExamReviewForm examId="exam-1" />);
		await user.click(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		);

		expect(
			screen.getByPlaceholderText(/Descreva suas observações/),
		).toBeInTheDocument();
	});

	it("salva as observações chamando useReviewExam com o examId e as notas digitadas", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseReviewExam.mockReturnValue({ mutateAsync } as never);

		render(<ExamReviewForm examId="exam-1" />);
		await user.click(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		);
		await user.type(
			screen.getByPlaceholderText(/Descreva suas observações/),
			"Exame dentro da normalidade",
		);
		await user.click(screen.getByRole("button", { name: "Salvar" }));

		await waitFor(() =>
			expect(mutateAsync).toHaveBeenCalledWith({
				examId: "exam-1",
				data: { professionalNotes: "Exame dentro da normalidade" },
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Observações salvas!");
	});

	it("mostra toast de erro quando salvar as observações falha", async () => {
		const user = userEvent.setup();
		mockUseReviewExam.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("fail")),
		} as never);

		render(<ExamReviewForm examId="exam-1" />);
		await user.click(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		);
		await user.type(
			screen.getByPlaceholderText(/Descreva suas observações/),
			"Notas",
		);
		await user.click(screen.getByRole("button", { name: "Salvar" }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("Erro ao salvar observações."),
		);
	});

	it("fecha o formulário ao clicar em Cancelar", async () => {
		const user = userEvent.setup();
		mockUseReviewExam.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<ExamReviewForm examId="exam-1" />);
		await user.click(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		);
		await user.click(screen.getByRole("button", { name: "Cancelar" }));

		expect(
			screen.getByRole("button", { name: /Adicionar observações/ }),
		).toBeInTheDocument();
	});
});

describe("ExamUploadButton", () => {
	it("renderiza o botão de envio de resultado", () => {
		mockUseUploadExamResult.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<ExamUploadButton examId="exam-1" />);

		expect(
			screen.getByRole("button", { name: /Enviar resultado/ }),
		).toBeInTheDocument();
	});

	it("envia o arquivo selecionado chamando useUploadExamResult com o examId e o arquivo", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseUploadExamResult.mockReturnValue({ mutateAsync } as never);

		const { container } = render(<ExamUploadButton examId="exam-1" />);

		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = new File(["conteudo"], "resultado.pdf", {
			type: "application/pdf",
		});

		await userEvent.upload(input, file);

		await waitFor(() =>
			expect(mutateAsync).toHaveBeenCalledWith({ examId: "exam-1", file }),
		);
		expect(toast.success).toHaveBeenCalledWith("Arquivo enviado com sucesso!");
	});

	it("mostra toast de erro quando o upload falha", async () => {
		mockUseUploadExamResult.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("fail")),
		} as never);

		const { container } = render(<ExamUploadButton examId="exam-1" />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = new File(["x"], "laudo.png", { type: "image/png" });

		await userEvent.upload(input, file);

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("Erro ao enviar arquivo."),
		);
	});
});

describe("RequestExamForm", () => {
	it("mostra apenas o botão de solicitar exame inicialmente", () => {
		mockUseCreateExamRequest.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<RequestExamForm appointmentId="appt-1" />);

		expect(
			screen.getByRole("button", { name: /Solicitar exame/ }),
		).toBeInTheDocument();
	});

	it("abre o formulário e cria a solicitação de exame ao submeter", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseCreateExamRequest.mockReturnValue({ mutateAsync } as never);

		render(<RequestExamForm appointmentId="appt-1" />);
		await user.click(screen.getByRole("button", { name: /Solicitar exame/ }));
		await user.click(screen.getByRole("button", { name: /Nome do exame/ }));
		await user.type(
			screen.getByPlaceholderText("Ex: Em jejum por 8 horas"),
			"Coleta pela manhã",
		);
		await user.click(screen.getByRole("button", { name: "Solicitar" }));

		await waitFor(() =>
			expect(mutateAsync).toHaveBeenCalledWith({
				examName: "HEMOGRAMA_COMPLETO",
				instructions: "Coleta pela manhã",
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Solicitação de exame criada!");
	});

	it("mostra toast de erro quando a criação da solicitação falha", async () => {
		const user = userEvent.setup();
		mockUseCreateExamRequest.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("fail")),
		} as never);

		render(<RequestExamForm appointmentId="appt-1" />);
		await user.click(screen.getByRole("button", { name: /Solicitar exame/ }));
		await user.click(screen.getByRole("button", { name: /Nome do exame/ }));
		await user.click(screen.getByRole("button", { name: "Solicitar" }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("Erro ao solicitar exame."),
		);
	});

	it("fecha o formulário ao clicar em Cancelar", async () => {
		const user = userEvent.setup();
		mockUseCreateExamRequest.mockReturnValue({ mutateAsync: vi.fn() } as never);

		render(<RequestExamForm appointmentId="appt-1" />);
		await user.click(screen.getByRole("button", { name: /Solicitar exame/ }));
		await user.click(screen.getByRole("button", { name: "Cancelar" }));

		expect(
			screen.getByRole("button", { name: /Solicitar exame/ }),
		).toBeInTheDocument();
	});
});
