import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReceptionistList } from "@/components/custom/clinic/ReceptionistList";

describe("ReceptionistList", () => {
	it("não renderiza nenhum card quando a lista está vazia", () => {
		const { container } = render(
			<ReceptionistList receptionists={[]} onRemove={vi.fn()} />,
		);
		expect(container.querySelectorAll("[data-slot=card]").length).toBe(0);
	});

	it("renderiza um card para cada recepcionista com nome e e-mail", () => {
		render(
			<ReceptionistList
				receptionists={[
					{ id: "r-1", name: "Ana", email: "ana@email.com" },
					{ id: "r-2", name: "Bruno", email: "bruno@email.com" },
				]}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Ana")).toBeInTheDocument();
		expect(screen.getByText("ana@email.com")).toBeInTheDocument();
		expect(screen.getByText("Bruno")).toBeInTheDocument();
		expect(screen.getByText("bruno@email.com")).toBeInTheDocument();
	});

	it("chama onRemove com o id correto ao clicar no botão de remover", async () => {
		const user = userEvent.setup();
		const onRemove = vi.fn();
		render(
			<ReceptionistList
				receptionists={[{ id: "r-1", name: "Ana", email: "ana@email.com" }]}
				onRemove={onRemove}
			/>,
		);
		await user.click(screen.getByRole("button"));
		expect(onRemove).toHaveBeenCalledWith("r-1");
	});
});
