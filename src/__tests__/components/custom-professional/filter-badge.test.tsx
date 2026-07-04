import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FilterBadge } from "@/components/custom/professional/FilterBadge";

describe("FilterBadge", () => {
	it("renderiza o conteúdo do badge", () => {
		render(<FilterBadge onRemove={vi.fn()}>Cardiologia</FilterBadge>);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renderiza o ícone quando fornecido", () => {
		render(
			<FilterBadge icon={<span data-testid="icon" />} onRemove={vi.fn()}>
				SP
			</FilterBadge>,
		);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("chama onRemove ao clicar no botão de remover", async () => {
		const user = userEvent.setup();
		const onRemove = vi.fn();
		render(<FilterBadge onRemove={onRemove}>SP</FilterBadge>);
		await user.click(screen.getByRole("button"));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});
});
