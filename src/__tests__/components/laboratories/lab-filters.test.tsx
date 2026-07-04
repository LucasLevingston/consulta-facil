import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { UseLabFiltersReturn } from "@/features/exams";

// Mock do Select (Radix) para simplificar a interação em jsdom, seguindo o
// padrão já usado em outros testes de componente deste repositório.
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

import { LabFilters } from "@/components/laboratories/LabFilters";
import { LabFiltersActiveBadges } from "@/components/laboratories/LabFiltersActiveBadges";
import { LabFiltersAdvancedPanel } from "@/components/laboratories/LabFiltersAdvancedPanel";
import { LabFiltersLocationControl } from "@/components/laboratories/LabFiltersLocationControl";
import { LabFiltersSearchRow } from "@/components/laboratories/LabFiltersSearchRow";

// Os componentes LabFilters* recebem o retorno do hook useLabFilters via prop
// `hook`, então basta construir um objeto mockado com o mesmo formato de
// UseLabFiltersReturn — não é necessário mockar o módulo do hook.
function makeHook(
	overrides: {
		filterState?: Partial<UseLabFiltersReturn["filterState"]>;
		location?: Partial<UseLabFiltersReturn["location"]>;
		options?: Partial<UseLabFiltersReturn["options"]>;
		derived?: Partial<UseLabFiltersReturn["derived"]>;
		actions?: Partial<UseLabFiltersReturn["actions"]>;
	} = {},
): UseLabFiltersReturn {
	return {
		filterState: {
			search: "",
			filterState: "",
			filterCity: "",
			expanded: false,
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
			setExpanded: vi.fn(),
			setRadiusKm: vi.fn(),
			clearFilters: vi.fn(),
			requestLocation: vi.fn(),
			clearLocation: vi.fn(),
			...overrides.actions,
		},
		displayed: [],
		isLoading: false,
		error: null,
	} as UseLabFiltersReturn;
}

describe("LabFiltersSearchRow", () => {
	it("renderiza o input de busca com o valor atual", () => {
		const hook = makeHook({ filterState: { search: "Lab X" } });
		render(<LabFiltersSearchRow hook={hook} />);
		expect(
			screen.getByPlaceholderText("Buscar por laboratório ou exame..."),
		).toHaveValue("Lab X");
	});

	it("chama actions.setSearch ao digitar no input de busca", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<LabFiltersSearchRow hook={hook} />);
		await user.type(
			screen.getByPlaceholderText("Buscar por laboratório ou exame..."),
			"a",
		);
		expect(hook.actions.setSearch).toHaveBeenCalled();
	});

	it("chama actions.setFilterState ao selecionar um estado", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<LabFiltersSearchRow hook={hook} />);
		await user.click(screen.getAllByTestId("select-trigger-btn")[0]);
		expect(hook.actions.setFilterState).toHaveBeenCalledWith("20");
	});

	it("chama actions.setExpanded ao clicar em 'Mais filtros'", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { expanded: false } });
		render(<LabFiltersSearchRow hook={hook} />);
		await user.click(screen.getByText("Mais filtros"));
		expect(hook.actions.setExpanded).toHaveBeenCalledWith(true);
	});

	it("mostra o contador de filtros avançados quando advancedCount > 0", () => {
		const hook = makeHook({ derived: { advancedCount: 2 } });
		render(<LabFiltersSearchRow hook={hook} />);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("mostra o botão 'Limpar' quando há filtros ativos e chama clearFilters", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { totalActive: 3 } });
		render(<LabFiltersSearchRow hook={hook} />);
		const clearButton = screen.getByText(/Limpar \(3\)/);
		await user.click(clearButton);
		expect(hook.actions.clearFilters).toHaveBeenCalledTimes(1);
	});

	it("não mostra o botão 'Limpar' quando não há filtros ativos", () => {
		const hook = makeHook({ derived: { totalActive: 0 } });
		render(<LabFiltersSearchRow hook={hook} />);
		expect(screen.queryByText(/Limpar/)).not.toBeInTheDocument();
	});
});

describe("LabFiltersActiveBadges", () => {
	it("renderiza badge de busca e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { search: "Hemograma" } });
		render(<LabFiltersActiveBadges hook={hook} />);
		expect(screen.getByText(/Hemograma/)).toBeInTheDocument();
		await user.click(screen.getByLabelText("Remover busca"));
		expect(hook.actions.setSearch).toHaveBeenCalledWith("");
	});

	it("renderiza badge de estado e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterState: "SP" } });
		render(<LabFiltersActiveBadges hook={hook} />);
		expect(screen.getByText("SP")).toBeInTheDocument();
		await user.click(screen.getByLabelText("Remover filtro de estado"));
		expect(hook.actions.setFilterState).toHaveBeenCalledWith("");
	});

	it("renderiza badge de cidade e remove ao clicar no X", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ filterState: { filterCity: "João Pessoa" } });
		render(<LabFiltersActiveBadges hook={hook} />);
		expect(screen.getByText("João Pessoa")).toBeInTheDocument();
		await user.click(screen.getByLabelText("Remover filtro de cidade"));
		expect(hook.actions.setFilterCity).toHaveBeenCalledWith("");
	});

	it("não renderiza nenhuma badge quando não há filtros ativos", () => {
		const hook = makeHook();
		const { container } = render(<LabFiltersActiveBadges hook={hook} />);
		expect(container.querySelectorAll("[data-slot=badge]").length).toBe(0);
	});
});

describe("LabFiltersAdvancedPanel", () => {
	it("renderiza o input de cidade com o valor atual", () => {
		const hook = makeHook({ filterState: { filterCity: "Campina Grande" } });
		render(<LabFiltersAdvancedPanel hook={hook} />);
		expect(screen.getByLabelText("Cidade")).toHaveValue("Campina Grande");
	});

	it("chama actions.setFilterCity ao digitar no input de cidade", async () => {
		const user = userEvent.setup();
		const hook = makeHook();
		render(<LabFiltersAdvancedPanel hook={hook} />);
		await user.type(screen.getByLabelText("Cidade"), "x");
		expect(hook.actions.setFilterCity).toHaveBeenCalled();
	});
});

describe("LabFiltersLocationControl", () => {
	it("mostra o botão 'Perto de mim' quando não está em modo nearby", () => {
		const hook = makeHook({ derived: { isNearbyMode: false } });
		render(<LabFiltersLocationControl hook={hook} />);
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});

	it("chama actions.requestLocation ao clicar em 'Perto de mim'", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: false } });
		render(<LabFiltersLocationControl hook={hook} />);
		await user.click(screen.getByText("Perto de mim"));
		expect(hook.actions.requestLocation).toHaveBeenCalledTimes(1);
	});

	it("desabilita o botão 'Perto de mim' quando locationLoading é true", () => {
		const hook = makeHook({
			derived: { isNearbyMode: false },
			location: { locationLoading: true },
		});
		render(<LabFiltersLocationControl hook={hook} />);
		expect(screen.getByText("Perto de mim").closest("button")).toBeDisabled();
	});

	it("mostra o badge de localização e o raio quando em modo nearby", () => {
		const hook = makeHook({
			derived: { isNearbyMode: true },
			location: { radiusKm: 25 },
		});
		render(<LabFiltersLocationControl hook={hook} />);
		expect(screen.getByText(/Perto de você \(25km\)/)).toBeInTheDocument();
	});

	it("chama actions.clearLocation ao clicar no X do badge de localização", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: true } });
		render(<LabFiltersLocationControl hook={hook} />);
		await user.click(screen.getByLabelText("Remover localização"));
		expect(hook.actions.clearLocation).toHaveBeenCalledTimes(1);
	});

	it("chama actions.setRadiusKm ao alterar o raio", async () => {
		const user = userEvent.setup();
		const hook = makeHook({ derived: { isNearbyMode: true } });
		render(<LabFiltersLocationControl hook={hook} />);
		await user.click(screen.getByTestId("select-trigger-btn"));
		expect(hook.actions.setRadiusKm).toHaveBeenCalledWith(20);
	});
});

describe("LabFilters (composição)", () => {
	it("sempre renderiza a busca e o controle de localização", () => {
		const hook = makeHook();
		render(<LabFilters hook={hook} />);
		expect(
			screen.getByPlaceholderText("Buscar por laboratório ou exame..."),
		).toBeInTheDocument();
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});

	it("renderiza o painel avançado somente quando expanded é true", () => {
		const hookCollapsed = makeHook({ filterState: { expanded: false } });
		const { rerender } = render(<LabFilters hook={hookCollapsed} />);
		expect(screen.queryByLabelText("Cidade")).not.toBeInTheDocument();

		const hookExpanded = makeHook({ filterState: { expanded: true } });
		rerender(<LabFilters hook={hookExpanded} />);
		expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
	});

	it("renderiza as badges ativas somente quando totalActive > 0", () => {
		const hookNoFilters = makeHook({ derived: { totalActive: 0 } });
		const { rerender } = render(<LabFilters hook={hookNoFilters} />);
		expect(screen.queryByLabelText("Remover busca")).not.toBeInTheDocument();

		const hookWithSearch = makeHook({
			filterState: { search: "Hemograma" },
			derived: { totalActive: 1 },
		});
		rerender(<LabFilters hook={hookWithSearch} />);
		expect(screen.getByLabelText("Remover busca")).toBeInTheDocument();
	});
});
