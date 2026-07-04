import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExamListItemReviewSection } from "@/components/exams/ExamListItemReviewSection";

// Testes da seção de revisão do exame pelo profissional: exibição do botão
// para abrir o formulário, do textarea de observações e do submit/cancelamento.

function renderSection(
	overrides: Partial<
		React.ComponentProps<typeof ExamListItemReviewSection>
	> = {},
) {
	const setShowReviewForm = vi.fn();
	const setReviewNotes = vi.fn();
	const onReview = vi.fn();
	const utils = render(
		<ExamListItemReviewSection
			isProfessional={true}
			examStatus="UPLOADED"
			showReviewForm={false}
			setShowReviewForm={setShowReviewForm}
			reviewNotes=""
			setReviewNotes={setReviewNotes}
			reviewing={false}
			onReview={onReview}
			{...overrides}
		/>,
	);
	return { ...utils, setShowReviewForm, setReviewNotes, onReview };
}

describe("ExamListItemReviewSection", () => {
	it("exibe o botão 'Adicionar observações' quando profissional, status UPLOADED e formulário fechado", () => {
		renderSection();
		expect(screen.getByText("Adicionar observações")).toBeInTheDocument();
	});

	it("não exibe o botão quando isProfessional=false", () => {
		renderSection({ isProfessional: false });
		expect(screen.queryByText("Adicionar observações")).not.toBeInTheDocument();
	});

	it("não exibe o botão quando examStatus não é UPLOADED", () => {
		renderSection({ examStatus: "REVIEWED" });
		expect(screen.queryByText("Adicionar observações")).not.toBeInTheDocument();
	});

	it("não exibe o botão quando o formulário já está aberto", () => {
		renderSection({ showReviewForm: true });
		expect(screen.queryByText("Adicionar observações")).not.toBeInTheDocument();
	});

	it("chama setShowReviewForm(true) ao clicar em 'Adicionar observações'", async () => {
		const { setShowReviewForm } = renderSection();
		await userEvent.click(screen.getByText("Adicionar observações"));
		expect(setShowReviewForm).toHaveBeenCalledWith(true);
	});

	it("exibe o textarea de observações quando showReviewForm=true", () => {
		renderSection({ showReviewForm: true });
		expect(
			screen.getByPlaceholderText(
				"Descreva suas observações sobre o resultado...",
			),
		).toBeInTheDocument();
	});

	it("chama setReviewNotes ao digitar no textarea", async () => {
		const { setReviewNotes } = renderSection({ showReviewForm: true });
		const textarea = screen.getByPlaceholderText(
			"Descreva suas observações sobre o resultado...",
		);
		await userEvent.type(textarea, "a");
		expect(setReviewNotes).toHaveBeenCalledWith("a");
	});

	it("chama onReview ao clicar em 'Salvar'", async () => {
		const { onReview } = renderSection({ showReviewForm: true });
		await userEvent.click(screen.getByText("Salvar"));
		expect(onReview).toHaveBeenCalledTimes(1);
	});

	it("exibe 'Salvando...' e desabilita o botão quando reviewing=true", () => {
		renderSection({ showReviewForm: true, reviewing: true });
		const button = screen.getByText("Salvando...");
		expect(button).toBeInTheDocument();
		expect(button.closest("button")).toBeDisabled();
	});

	it("chama setShowReviewForm(false) ao clicar em 'Cancelar'", async () => {
		const { setShowReviewForm } = renderSection({ showReviewForm: true });
		await userEvent.click(screen.getByText("Cancelar"));
		expect(setShowReviewForm).toHaveBeenCalledWith(false);
	});
});
