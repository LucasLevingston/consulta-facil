import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { UseClinicsFiltersReturn } from "@/app/clinics/use-clinics-filters";

// Mock do Select (Radix) para simplificar a interação em jsdom, seguindo o
// padrão já usado em src/__tests__/components/laboratories/lab-filters.test.tsx.
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value}>
			<button
				type="button"
				data-testid="select-trigger-btn"
				onClick={() => onValueChange?.("20")}
			>
				trigger
			</button>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => <span />,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import { ClinicsFilters } from "@/components/clinics/ClinicsFilters";
import { ClinicsFiltersActiveChips } from "@/components/clinics/ClinicsFiltersActiveChips";
import { ClinicsFiltersAdvancedPanel } from "@/components/clinics/ClinicsFiltersAdvancedPanel";
import { ClinicsFiltersDayPicker } from "@/components/clinics/ClinicsFiltersDayPicker";
import { ClinicsFiltersSelectsRow } from "@/components/clinics/ClinicsFiltersSelectsRow";
import { ClinicsFiltersTopRow } from "@/components/clinics/ClinicsFiltersTopRow";
import { ClinicsLocationViewControls } from "@/components/clinics/ClinicsLocationViewControls";

// Os componentes ClinicsFilters* recebem o retorno do hook useClinicsFilters
// via prop `hook`, então basta montar um objeto mockado no mesmo formato de
// UseClinicsFiltersReturn — não é necessário mockar o módulo do hook.
function makeHook(
	overrides: {
		filterState?: Partial<UseClinicsFiltersReturn["filterState"]>;
		location?: Partial<UseClinicsFiltersReturn["location"]>;
		options?: Partial<UseClinicsFiltersReturn["options"]>;
		derived?: Partial<UseClinicsFiltersReturn["derived"]>;
		actions?: Partial<UseClinicsFiltersReturn["actions"]>;
	} = {},
): UseClinicsFiltersReturn {
	return {
		filterState: {
			search: "",
			filterState: "",
			filterCity: "",
			filterSpecialty: "",
			filterProfession: "",
			selectedDays: [],
			expanded: false,
			viewMode: "list",
			...overrides.filterState,
		},
		location: {
			userLocation: null,
			locationLoading: false,
			radiusKm: 10,
			...overrides.location,
		},
		options: {
			availableStates: ["PB", "SP"],
			availableSpecialties: ["Cardiologia", "Dermatologia"],
			availableProfessions: ["Medico", "Enfermeiro"],
			radiusOptions: [
				{ value: "10", label: "10 km" },
				{ value: "25", label: "25 km" },
			],
			...overrides.options,
		},
		derived: {
			totalActive: 0,
			advancedCount: 0,
			isNearbyMode: false,
			...overrides.derived,
		},
		actions: {
			setSearch: vi.fn(),
			setFilterState: vi.fn(),
			setFilterCity: vi.fn(),
			setFilterSpecialty: vi.fn(),
			setFilterProfession: vi.fn(),
			setSelectedDays: vi.fn(),
			setExpanded: vi.fn(),
			setViewMode: vi.fn(),
			setRadiusKm: vi.fn(),
			clearFilters: vi.fn(),
			requestLocation: vi.fn(),
			clearLocation: vi.fn(),
			...overrides.actions,
		},
		displayed: [],
		isLoading: false,
		error: null,
	} as UseClinicsFiltersReturn;
}

describe("ClinicsFiltersTopRow", () => {
	it("renderiza o input de busca com o valor atual", () => {
		const hook = makeHook({ filterState: { search: "Clinica Central" } });
		render(<ClinicsFiltersTopRow hook={hook} />);
		expect(screen.getByPlaceholderText("Buscar clínica...")).toHaveValue(
			"Clinica Central",
		);
	});

	it("chama actions.setSearch ao digitar no input de busca", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<ClinicsFiltersTopRow hook={hook} />);
		await user.type(screen.getByPlaceholderText("Buscar clínica..."), "a");
		expect(hook.actions.setSearch).toHaveBeenCalled();
	});

	it("chama actions.setFilterState ao selecionar um estado", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<ClinicsFiltersTopRow hook={hook} />);
		await user.click(screen.getByTestId("select-trigger-btn"));
		expect(hook.actions.setFilterState).toHaveBeenCalledWith("20");
	});

	it("chama actions.setExpanded ao clicar em 'Mais filtros'", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { expanded: false } });
		render(<ClinicsFiltersTopRow hook={hook} />);
		await user.click(screen.getByText("Mais filtros"));
		expect(hook.actions.setExpanded).toHaveBeenCalledWith(true);
	});

	it("mostra o contador de filtros avançados quando advancedCount > 0", () => {
		const hook = makeHook({ derived: { advancedCount: 2 } });
		render(<ClinicsFiltersTopRow hook={hook} />);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("mostra o botão 'Limpar' quando há filtros ativos e chama clearFilters", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { totalActive: 3 } });
		render(<ClinicsFiltersTopRow hook={hook} />);
		const clearButton = screen.getByText(/Limpar \(3\)/);
		await user.click(clearButton);
		expect(hook.actions.clearFilters).toHaveBeenCalledTimes(1);
	});

	it("não mostra o botão 'Limpar' quando não há filtros ativos", () => {
		const hook = makeHook({ derived: { totalActive: 0 } });
		render(<ClinicsFiltersTopRow hook={hook} />);
		expect(screen.queryByText(/Limpar/)).not.toBeInTheDocument();
	});

	it("renderiza o controle de localização (ClinicsLocationViewControls)", () => {
		const hook = makeHook();
		render(<ClinicsFiltersTopRow hook={hook} />);
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});
});

describe("ClinicsLocationViewControls", () => {
	it("mostra o botão 'Perto de mim' quando não está em modo nearby", () => {
		const hook = makeHook({ derived: { isNearbyMode: false } });
		render(<ClinicsLocationViewControls hook={hook} />);
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});

	it("chama actions.requestLocation ao clicar em 'Perto de mim'", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: false } });
		render(<ClinicsLocationViewControls hook={hook} />);
		await user.click(screen.getByText("Perto de mim"));
		expect(hook.actions.requestLocation).toHaveBeenCalledTimes(1);
	});

	it("desabilita o botão 'Perto de mim' quando locationLoading é true", () => {
		const hook = makeHook({
			derived: { isNearbyMode: false },
			location: { locationLoading: true },
		});
		render(<ClinicsLocationViewControls hook={hook} />);
		expect(screen.getByText("Perto de mim").closest("button")).toBeDisabled();
	});

	it("mostra o badge de localização e o raio quando em modo nearby", () => {
		const hook = makeHook({
			derived: { isNearbyMode: true },
			location: { radiusKm: 25 },
		});
		render(<ClinicsLocationViewControls hook={hook} />);
		expect(screen.getByText(/Perto de você \(25km\)/)).toBeInTheDocument();
	});

	it("chama actions.clearLocation ao clicar no X do badge de localização", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: true } });
		render(<ClinicsLocationViewControls hook={hook} />);
		const badge = screen
			.getByText(/Perto de você/)
			.closest('[data-slot="badge"]') as HTMLElement;
		const removeButton = badge.querySelector("button") as HTMLElement;
		await user.click(removeButton);
		expect(hook.actions.clearLocation).toHaveBeenCalledTimes(1);
	});

	it("chama actions.setRadiusKm ao alterar o raio quando em modo nearby", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: true } });
		render(<ClinicsLocationViewControls hook={hook} />);
		await user.click(screen.getByTestId("select-trigger-btn"));
		expect(hook.actions.setRadiusKm).toHaveBeenCalledWith(20);
	});

	it("chama actions.setViewMode ao clicar nos botões de lista e mapa", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: false } });
		render(<ClinicsLocationViewControls hook={hook} />);
		const buttons = screen.getAllByRole("button");
		// ordem: "Perto de mim", lista, mapa
		await user.click(buttons[1]);
		expect(hook.actions.setViewMode).toHaveBeenCalledWith("list");
		await user.click(buttons[2]);
		expect(hook.actions.setViewMode).toHaveBeenCalledWith("map");
	});
});

describe("ClinicsFiltersSelectsRow", () => {
	const baseProps = {
		filterSpecialty: "",
		filterProfession: "",
		availableSpecialties: ["Cardiologia", "Dermatologia"],
		availableProfessions: ["Medico", "Enfermeiro"],
		onSpecialtyChange: vi.fn(),
		onProfessionChange: vi.fn(),
	};

	it("renderiza os selects de especialidade e tipo de profissional", () => {
		render(<ClinicsFiltersSelectsRow {...baseProps} />);
		expect(screen.getByText("Especialidade")).toBeInTheDocument();
		expect(screen.getByText("Tipo de profissional")).toBeInTheDocument();
	});

	it("chama onSpecialtyChange ao selecionar uma especialidade", async () => {
		const user = userEvent.setup();
		const onSpecialtyChange = vi.fn();
		render(
			<ClinicsFiltersSelectsRow
				{...baseProps}
				onSpecialtyChange={onSpecialtyChange}
			/>,
		);
		const triggers = screen.getAllByTestId("select-trigger-btn");
		await user.click(triggers[0]);
		expect(onSpecialtyChange).toHaveBeenCalledWith("20");
	});

	it("chama onProfessionChange ao selecionar um tipo de profissional", async () => {
		const user = userEvent.setup();
		const onProfessionChange = vi.fn();
		render(
			<ClinicsFiltersSelectsRow
				{...baseProps}
				onProfessionChange={onProfessionChange}
			/>,
		);
		const triggers = screen.getAllByTestId("select-trigger-btn");
		await user.click(triggers[1]);
		expect(onProfessionChange).toHaveBeenCalledWith("20");
	});

	it("não renderiza o select de tipo de profissional quando não há opções disponíveis", () => {
		render(
			<ClinicsFiltersSelectsRow {...baseProps} availableProfessions={[]} />,
		);
		expect(screen.queryByText("Tipo de profissional")).not.toBeInTheDocument();
	});
});

describe("ClinicsFiltersDayPicker", () => {
	it("renderiza todos os dias da semana", () => {
		render(<ClinicsFiltersDayPicker selectedDays={[]} onToggle={vi.fn()} />);
		["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].forEach((label) => {
			expect(screen.getByText(label)).toBeInTheDocument();
		});
	});

	it("chama onToggle com a chave do dia clicado", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();
		render(<ClinicsFiltersDayPicker selectedDays={[]} onToggle={onToggle} />);
		await user.click(screen.getByText("Seg"));
		expect(onToggle).toHaveBeenCalledWith("MONDAY");
	});

	it("aplica destaque visual ao dia selecionado", () => {
		render(
			<ClinicsFiltersDayPicker selectedDays={["MONDAY"]} onToggle={vi.fn()} />,
		);
		expect(screen.getByText("Seg").className).toContain("bg-primary");
	});
});

describe("ClinicsFiltersAdvancedPanel", () => {
	it("renderiza o input de cidade com o valor atual", () => {
		const hook = makeHook({ filterState: { filterCity: "Campinas" } });
		render(<ClinicsFiltersAdvancedPanel hook={hook} />);
		expect(screen.getByLabelText("Cidade")).toHaveValue("Campinas");
	});

	it("chama actions.setFilterCity ao digitar no input de cidade", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<ClinicsFiltersAdvancedPanel hook={hook} />);
		await user.type(screen.getByLabelText("Cidade"), "x");
		expect(hook.actions.setFilterCity).toHaveBeenCalled();
	});

	it("renderiza o seletor de dias e chama setSelectedDays ao marcar um dia", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { selectedDays: [] } });
		render(<ClinicsFiltersAdvancedPanel hook={hook} />);
		await user.click(screen.getByText("Seg"));
		expect(hook.actions.setSelectedDays).toHaveBeenCalledWith(["MONDAY"]);
	});

	it("remove o dia de selectedDays ao clicar em um dia já selecionado", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { selectedDays: ["MONDAY"] } });
		render(<ClinicsFiltersAdvancedPanel hook={hook} />);
		await user.click(screen.getByText("Seg"));
		expect(hook.actions.setSelectedDays).toHaveBeenCalledWith([]);
	});
});

describe("ClinicsFiltersActiveChips", () => {
	it("renderiza chip de busca e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { search: "Bem Estar" } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText(/Bem Estar/)
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setSearch).toHaveBeenCalledWith("");
	});

	it("renderiza chip de estado e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterState: "SP" } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText("SP")
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setFilterState).toHaveBeenCalledWith("");
	});

	it("renderiza chip de cidade e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterCity: "Campinas" } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText("Campinas")
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setFilterCity).toHaveBeenCalledWith("");
	});

	it("renderiza chip de especialidade e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterSpecialty: "Cardiologia" } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText("Cardiologia")
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setFilterSpecialty).toHaveBeenCalledWith("");
	});

	it("renderiza chip de profissão e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterProfession: "Medico" } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText("Medico")
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setFilterProfession).toHaveBeenCalledWith("");
	});

	it("renderiza chip de dia selecionado e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { selectedDays: ["MONDAY"] } });
		render(<ClinicsFiltersActiveChips hook={hook} />);
		const chip = screen
			.getByText("Seg")
			.closest('[data-slot="badge"]') as HTMLElement;
		await user.click(chip.querySelector("button") as HTMLElement);
		expect(hook.actions.setSelectedDays).toHaveBeenCalledWith([]);
	});

	it("não renderiza nenhum chip quando não há filtros ativos", () => {
		const hook = makeHook();
		const { container } = render(<ClinicsFiltersActiveChips hook={hook} />);
		expect(container.querySelectorAll('[data-slot="badge"]').length).toBe(0);
	});
});

describe("ClinicsFilters (composição)", () => {
	it("sempre renderiza a linha de busca principal", () => {
		const hook = makeHook();
		render(<ClinicsFilters hook={hook} />);
		expect(
			screen.getByPlaceholderText("Buscar clínica..."),
		).toBeInTheDocument();
	});

	it("renderiza o painel avançado somente quando expanded é true", () => {
		const hookCollapsed = makeHook({ filterState: { expanded: false } });
		const { rerender } = render(<ClinicsFilters hook={hookCollapsed} />);
		expect(screen.queryByLabelText("Cidade")).not.toBeInTheDocument();

		const hookExpanded = makeHook({ filterState: { expanded: true } });
		rerender(<ClinicsFilters hook={hookExpanded} />);
		expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
	});

	it("renderiza os chips ativos somente quando totalActive > 0", () => {
		const hookNoFilters = makeHook({ derived: { totalActive: 0 } });
		const { rerender, container } = render(
			<ClinicsFilters hook={hookNoFilters} />,
		);
		expect(container.querySelectorAll('[data-slot="badge"]').length).toBe(0);

		const hookWithSearch = makeHook({
			filterState: { search: "Bem Estar" },
			derived: { totalActive: 1 },
		});
		rerender(<ClinicsFilters hook={hookWithSearch} />);
		expect(screen.getByText(/Bem Estar/)).toBeInTheDocument();
	});
});
