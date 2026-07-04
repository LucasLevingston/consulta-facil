import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfessionalFiltersBasicRow } from "@/components/custom/professional/ProfessionalFiltersBasicRow";
import type { useProfessionalFilters } from "@/components/custom/professional/useProfessionalFilters";

function makeFilters(
	overrides: Partial<ReturnType<typeof useProfessionalFilters>> = {},
): ReturnType<typeof useProfessionalFilters> {
	return {
		name: "",
		setName: vi.fn(),
		profession: "",
		specialty: "",
		setSpecialty: vi.fn(),
		serviceTitle: "",
		setServiceTitle: vi.fn(),
		state: "",
		setState: vi.fn(),
		selectedDays: [],
		expanded: false,
		setExpanded: vi.fn(),
		availableSpecialties: [],
		advancedCount: 0,
		totalActive: 0,
		handleProfessionChange: vi.fn(),
		toggleDay: vi.fn(),
		clearAll: vi.fn(),
		...overrides,
	} as ReturnType<typeof useProfessionalFilters>;
}

describe("ProfessionalFiltersBasicRow", () => {
	it("renderiza o input de busca por nome com o valor atual", () => {
		const filters = makeFilters({ name: "João" });
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		expect(screen.getByPlaceholderText("Buscar por nome...")).toHaveValue(
			"João",
		);
	});

	it("chama setName ao digitar no input de busca", async () => {
		const user = userEvent.setup();
		const filters = makeFilters();
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		await user.type(screen.getByPlaceholderText("Buscar por nome..."), "a");
		expect(filters.setName).toHaveBeenCalled();
	});

	it("chama setExpanded ao clicar em 'Mais filtros'", async () => {
		const user = userEvent.setup();
		const filters = makeFilters();
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		await user.click(screen.getByText("Mais filtros"));
		expect(filters.setExpanded).toHaveBeenCalledTimes(1);
		// setExpanded recebe uma função que alterna o valor anterior
		const updater = (filters.setExpanded as ReturnType<typeof vi.fn>).mock
			.calls[0][0];
		expect(updater(false)).toBe(true);
	});

	it("mostra o contador de filtros avançados quando advancedCount > 0", () => {
		const filters = makeFilters({ advancedCount: 2 });
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("mostra o botão 'Limpar' e chama clearAll quando há filtros ativos", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ totalActive: 3 });
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		const clearButton = screen.getByText(/Limpar \(3\)/);
		await user.click(clearButton);
		expect(filters.clearAll).toHaveBeenCalledTimes(1);
	});

	it("não mostra o botão 'Limpar' quando não há filtros ativos", () => {
		const filters = makeFilters({ totalActive: 0 });
		render(<ProfessionalFiltersBasicRow filters={filters} />);
		expect(screen.queryByText(/Limpar/)).not.toBeInTheDocument();
	});
});
