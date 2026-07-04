import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/custom/professional/ProfessionalCard", () => ({
	default: ({
		professional,
	}: {
		professional: { id: string; name?: string };
	}) => (
		<div>
			ProfessionalCard:{professional.id}:{professional.name}
		</div>
	),
}));

import ProfessionalsList from "@/components/custom/professional/ProfessionalsList";

describe("ProfessionalsList", () => {
	it("mostra mensagem de lista vazia quando não há profissionais", () => {
		render(<ProfessionalsList professionals={[]} />);
		expect(
			screen.getByText(
				"Nenhum profissional encontrado com os filtros selecionados.",
			),
		).toBeInTheDocument();
	});

	it("renderiza um card para cada profissional", () => {
		render(
			<ProfessionalsList
				professionals={
					[
						{ id: "p-1", name: "Ana" },
						{ id: "p-2", name: "Bruno" },
					] as never
				}
			/>,
		);
		expect(screen.getByText("ProfessionalCard:p-1:Ana")).toBeInTheDocument();
		expect(screen.getByText("ProfessionalCard:p-2:Bruno")).toBeInTheDocument();
	});

	it("não mostra a mensagem de lista vazia quando há profissionais", () => {
		render(
			<ProfessionalsList
				professionals={[{ id: "p-1", name: "Ana" }] as never}
			/>,
		);
		expect(
			screen.queryByText(
				"Nenhum profissional encontrado com os filtros selecionados.",
			),
		).not.toBeInTheDocument();
	});
});
