import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FeaturesTable } from "@/components/admin/billing/FeaturesTable";
import type { FeatureResponse } from "@/features/billing";

function makeFeature(
	overrides: Partial<FeatureResponse> = {},
): FeatureResponse {
	return {
		id: "f-1",
		key: "PRIORITY_SUPPORT",
		name: "Suporte prioritário",
		description: "Atendimento prioritário via chat",
		...overrides,
	} as FeatureResponse;
}

describe("FeaturesTable", () => {
	it("renderiza o cabeçalho da tabela mesmo sem features", () => {
		render(
			<FeaturesTable features={[]} handleDelete={vi.fn()} deleting={false} />,
		);

		expect(screen.getByText("Chave")).toBeInTheDocument();
		expect(screen.getByText("Nome")).toBeInTheDocument();
		expect(screen.getByText("Descrição")).toBeInTheDocument();
		expect(screen.getByText("Ações")).toBeInTheDocument();
	});

	it("não renderiza nenhuma linha quando a lista de features está vazia", () => {
		render(
			<FeaturesTable features={[]} handleDelete={vi.fn()} deleting={false} />,
		);
		expect(screen.queryAllByRole("row")).toHaveLength(1); // apenas o header
	});

	it("renderiza uma linha por feature com seus dados", () => {
		render(
			<FeaturesTable
				features={[makeFeature()]}
				handleDelete={vi.fn()}
				deleting={false}
			/>,
		);

		expect(screen.getByText("PRIORITY_SUPPORT")).toBeInTheDocument();
		expect(screen.getByText("Suporte prioritário")).toBeInTheDocument();
		expect(
			screen.getByText("Atendimento prioritário via chat"),
		).toBeInTheDocument();
	});

	it("mostra travessão quando a descrição é nula", () => {
		render(
			<FeaturesTable
				features={[makeFeature({ description: null })]}
				handleDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("chama handleDelete com o id da feature ao clicar no botão de excluir", async () => {
		const user = userEvent.setup();
		const handleDelete = vi.fn();
		render(
			<FeaturesTable
				features={[makeFeature({ id: "f-42" })]}
				handleDelete={handleDelete}
				deleting={false}
			/>,
		);

		await user.click(screen.getByRole("button"));
		expect(handleDelete).toHaveBeenCalledWith("f-42");
	});

	it("desabilita o botão de excluir quando deleting=true", () => {
		render(
			<FeaturesTable
				features={[makeFeature()]}
				handleDelete={vi.fn()}
				deleting={true}
			/>,
		);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("renderiza múltiplas features em linhas separadas", () => {
		render(
			<FeaturesTable
				features={[
					makeFeature({ id: "f-1", key: "A", name: "Feature A" }),
					makeFeature({ id: "f-2", key: "B", name: "Feature B" }),
				]}
				handleDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText("Feature A")).toBeInTheDocument();
		expect(screen.getByText("Feature B")).toBeInTheDocument();
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});
});
