import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfessionalFiltersAdvanced } from "@/components/custom/professional/ProfessionalFiltersAdvanced";
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

describe("ProfessionalFiltersAdvanced", () => {
	it("renderiza o input de serviço com o valor atual", () => {
		const filters = makeFilters({ serviceTitle: "Botox" });
		render(<ProfessionalFiltersAdvanced filters={filters} />);
		expect(screen.getByPlaceholderText(/Botox/)).toHaveValue("Botox");
	});

	it("chama setServiceTitle ao digitar no input de serviço", async () => {
		const user = userEvent.setup();
		const filters = makeFilters();
		render(<ProfessionalFiltersAdvanced filters={filters} />);
		await user.type(screen.getByPlaceholderText(/Botox/), "a");
		expect(filters.setServiceTitle).toHaveBeenCalled();
	});

	it("renderiza um botão para cada dia da semana", () => {
		const filters = makeFilters();
		render(<ProfessionalFiltersAdvanced filters={filters} />);
		expect(screen.getByText("Seg")).toBeInTheDocument();
		expect(screen.getByText("Dom")).toBeInTheDocument();
	});

	it("chama toggleDay ao clicar em um dia", async () => {
		const user = userEvent.setup();
		const filters = makeFilters();
		render(<ProfessionalFiltersAdvanced filters={filters} />);
		await user.click(screen.getByText("Seg"));
		expect(filters.toggleDay).toHaveBeenCalledWith("MONDAY");
	});

	it("aplica destaque visual nos dias selecionados", () => {
		const filters = makeFilters({ selectedDays: ["MONDAY"] });
		render(<ProfessionalFiltersAdvanced filters={filters} />);
		expect(screen.getByText("Seg")).toHaveClass("bg-primary");
	});
});
