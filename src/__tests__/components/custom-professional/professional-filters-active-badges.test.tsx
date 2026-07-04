import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfessionalFiltersActiveBadges } from "@/components/custom/professional/ProfessionalFiltersActiveBadges";
import type { useProfessionalFilters } from "@/components/custom/professional/useProfessionalFilters";

// ProfessionalFilters* recebem o retorno do hook useProfessionalFilters via
// prop `filters`, então basta montar um objeto mockado com o mesmo formato,
// seguindo o mesmo padrão usado nos testes de LabFilters.
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

describe("ProfessionalFiltersActiveBadges", () => {
	it("não renderiza nenhuma badge quando não há filtros ativos", () => {
		const filters = makeFilters();
		const { container } = render(
			<ProfessionalFiltersActiveBadges filters={filters} />,
		);
		expect(container.querySelectorAll("[data-slot=badge]").length).toBe(0);
	});

	it("renderiza a badge de nome e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ name: "Maria" });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText(/Maria/)).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(filters.setName).toHaveBeenCalledWith("");
	});

	it("renderiza a badge de profissão e remove com handleProfessionChange(ALL)", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ profession: "MEDICO" });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText("MEDICO")).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(filters.handleProfessionChange).toHaveBeenCalledWith("__all__");
	});

	it("renderiza a badge de especialidade e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ specialty: "CARDIOLOGIA" });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText("CARDIOLOGIA")).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(filters.setSpecialty).toHaveBeenCalledWith("");
	});

	it("renderiza a badge de serviço e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ serviceTitle: "Botox" });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText("Botox")).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(filters.setServiceTitle).toHaveBeenCalledWith("");
	});

	it("renderiza a badge de estado e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ state: "SP" });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText("SP")).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(filters.setState).toHaveBeenCalledWith("");
	});

	it("renderiza uma badge por dia selecionado e remove com toggleDay", async () => {
		const user = userEvent.setup();
		const filters = makeFilters({ selectedDays: ["MONDAY", "FRIDAY"] });
		render(<ProfessionalFiltersActiveBadges filters={filters} />);
		expect(screen.getByText("Seg")).toBeInTheDocument();
		expect(screen.getByText("Sex")).toBeInTheDocument();
		await user.click(screen.getAllByRole("button")[0]);
		expect(filters.toggleDay).toHaveBeenCalledWith("MONDAY");
	});
});
