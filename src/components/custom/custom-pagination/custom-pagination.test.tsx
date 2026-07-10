import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomPagination } from "./custom-pagination";

describe("CustomPagination", () => {
	it("não renderiza nada quando há apenas uma página", () => {
		const { container } = render(
			<CustomPagination
				currentPage={0}
				totalPages={1}
				onPageChange={vi.fn()}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renderiza a informação da página atual", () => {
		render(
			<CustomPagination
				currentPage={1}
				totalPages={5}
				onPageChange={vi.fn()}
			/>,
		);
		const info = screen.getByText(/Página/).closest("p");
		expect(info).toHaveTextContent("Página 2 de 5");
	});

	it("oculta a informação de página quando showInfo é falso", () => {
		render(
			<CustomPagination
				currentPage={0}
				totalPages={3}
				onPageChange={vi.fn()}
				showInfo={false}
			/>,
		);
		expect(screen.queryByText(/Página/)).not.toBeInTheDocument();
	});

	it("desabilita o botão anterior na primeira página", () => {
		render(
			<CustomPagination
				currentPage={0}
				totalPages={3}
				onPageChange={vi.fn()}
			/>,
		);
		expect(screen.getByLabelText("Página anterior")).toBeDisabled();
	});

	it("desabilita o botão próximo na última página", () => {
		render(
			<CustomPagination
				currentPage={2}
				totalPages={3}
				onPageChange={vi.fn()}
			/>,
		);
		expect(screen.getByLabelText("Próxima página")).toBeDisabled();
	});

	it("chama onPageChange com a página seguinte ao clicar em próximo", async () => {
		const onPageChange = vi.fn();
		render(
			<CustomPagination
				currentPage={0}
				totalPages={3}
				onPageChange={onPageChange}
			/>,
		);
		await userEvent.click(screen.getByLabelText("Próxima página"));
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it("chama onPageChange com a página anterior ao clicar em anterior", async () => {
		const onPageChange = vi.fn();
		render(
			<CustomPagination
				currentPage={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>,
		);
		await userEvent.click(screen.getByLabelText("Página anterior"));
		expect(onPageChange).toHaveBeenCalledWith(0);
	});

	it("chama onPageChange ao clicar diretamente em um número de página", async () => {
		const onPageChange = vi.fn();
		render(
			<CustomPagination
				currentPage={0}
				totalPages={3}
				onPageChange={onPageChange}
			/>,
		);
		await userEvent.click(screen.getByLabelText("Ir para página 2"));
		expect(onPageChange).toHaveBeenCalledWith(1);
	});
});
