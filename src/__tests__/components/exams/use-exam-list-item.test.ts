import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes do hook useExamListItem: orquestra upload de resultado,
// cancelamento de agendamento e revisão de exame pelo profissional.

const { uploadMutate, reviewMutate, cancelMutate } = vi.hoisted(() => ({
	uploadMutate: vi.fn(),
	reviewMutate: vi.fn(),
	cancelMutate: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/features/exams", () => ({
	useUploadExamResult: () => ({ mutateAsync: uploadMutate }),
	useReviewExam: () => ({ mutateAsync: reviewMutate }),
	useCancelExamScheduling: () => ({
		mutateAsync: cancelMutate,
		isPending: false,
	}),
}));

import { toast } from "sonner";
import { useExamListItem } from "@/components/exams/useExamListItem";

const baseExam = {
	id: "e-1",
	appointmentId: "a-1",
	professionalId: "p-1",
	patientId: "pt-1",
	examName: "HEMOGRAMA_COMPLETO",
	status: "PENDING",
	schedulingId: "s-1",
} as never;

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useExamListItem", () => {
	it("inicia com os estados padrão", () => {
		const { result } = renderHook(() => useExamListItem(baseExam));
		expect(result.current.uploading).toBe(false);
		expect(result.current.reviewing).toBe(false);
		expect(result.current.showReviewForm).toBe(false);
		expect(result.current.reviewNotes).toBe("");
	});

	it("handleUpload não faz nada quando nenhum arquivo é selecionado", async () => {
		const { result } = renderHook(() => useExamListItem(baseExam));
		await act(async () => {
			await result.current.handleUpload({
				target: { files: [] },
			} as never);
		});
		expect(uploadMutate).not.toHaveBeenCalled();
	});

	it("handleUpload envia o arquivo e mostra toast de sucesso", async () => {
		uploadMutate.mockResolvedValue(undefined);
		const { result } = renderHook(() => useExamListItem(baseExam));
		const file = new File(["conteudo"], "resultado.pdf");
		await act(async () => {
			await result.current.handleUpload({
				target: { files: [file] },
			} as never);
		});
		expect(uploadMutate).toHaveBeenCalledWith({ examId: "e-1", file });
		expect(toast.success).toHaveBeenCalledWith("Arquivo enviado com sucesso!");
		expect(result.current.uploading).toBe(false);
	});

	it("handleUpload mostra toast de erro quando o upload falha", async () => {
		uploadMutate.mockRejectedValue(new Error("fail"));
		const { result } = renderHook(() => useExamListItem(baseExam));
		const file = new File(["x"], "a.pdf");
		await act(async () => {
			await result.current.handleUpload({
				target: { files: [file] },
			} as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao enviar arquivo.");
	});

	it("handleCancelScheduling não faz nada quando não há schedulingId", async () => {
		const exam = { ...baseExam, schedulingId: null };
		const { result } = renderHook(() => useExamListItem(exam as never));
		await act(async () => {
			await result.current.handleCancelScheduling();
		});
		expect(cancelMutate).not.toHaveBeenCalled();
	});

	it("handleCancelScheduling cancela o agendamento e mostra toast de sucesso", async () => {
		cancelMutate.mockResolvedValue(undefined);
		const { result } = renderHook(() => useExamListItem(baseExam));
		await act(async () => {
			await result.current.handleCancelScheduling();
		});
		expect(cancelMutate).toHaveBeenCalledWith("s-1");
		expect(toast.success).toHaveBeenCalledWith("Agendamento cancelado.");
	});

	it("handleCancelScheduling mostra toast de erro quando a mutation falha", async () => {
		cancelMutate.mockRejectedValue(new Error("fail"));
		const { result } = renderHook(() => useExamListItem(baseExam));
		await act(async () => {
			await result.current.handleCancelScheduling();
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar agendamento.");
	});

	it("handleReview não faz nada quando reviewNotes está vazio", async () => {
		const { result } = renderHook(() => useExamListItem(baseExam));
		await act(async () => {
			await result.current.handleReview();
		});
		expect(reviewMutate).not.toHaveBeenCalled();
	});

	it("handleReview envia as observações e fecha o formulário em caso de sucesso", async () => {
		reviewMutate.mockResolvedValue(undefined);
		const { result } = renderHook(() => useExamListItem(baseExam));
		act(() => {
			result.current.setReviewNotes("Tudo dentro do esperado");
			result.current.setShowReviewForm(true);
		});
		await act(async () => {
			await result.current.handleReview();
		});
		expect(reviewMutate).toHaveBeenCalledWith({
			examId: "e-1",
			data: { professionalNotes: "Tudo dentro do esperado" },
		});
		expect(toast.success).toHaveBeenCalledWith("Observações salvas!");
		expect(result.current.showReviewForm).toBe(false);
	});

	it("handleReview mostra toast de erro quando a mutation falha", async () => {
		reviewMutate.mockRejectedValue(new Error("fail"));
		const { result } = renderHook(() => useExamListItem(baseExam));
		act(() => {
			result.current.setReviewNotes("nota");
		});
		await act(async () => {
			await result.current.handleReview();
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar observações.");
	});
});
