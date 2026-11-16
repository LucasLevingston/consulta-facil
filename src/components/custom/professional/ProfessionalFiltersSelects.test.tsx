import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Native <select> stand-in for the Radix select so the value/onValueChange contract can be driven.
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
		<select value={value} onChange={(e) => onValueChange?.(e.target.value)}>
			{children}
		</select>
	),
	SelectTrigger: () => null,
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <option value={value}>{children}</option>,
}));

import { ALL } from "@/utils/constants/filter-sentinels";
import { professions } from "@/utils/constants/profession-specialties";
import { ProfessionalFiltersSelects } from "./ProfessionalFiltersSelects";

function makeFilters(overrides: Record<string, unknown> = {}) {
	return {
		profession: "",
		specialty: "",
		availableSpecialties: ["Cardiologia", "Pediatria"],
		handleProfessionChange: vi.fn(),
		setSpecialty: vi.fn(),
		...overrides,
	} as never;
}

describe("ProfessionalFiltersSelects", () => {
	it("starts both selects on 'all' and lists every profession", () => {
		render(<ProfessionalFiltersSelects filters={makeFilters()} />);

		const [profession, specialty] = screen.getAllByRole("combobox");
		expect(profession).toHaveValue(ALL);
		expect(specialty).toHaveValue(ALL);
		expect(
			screen.getByRole("option", { name: "Todas as profissões" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("option", { name: professions[0] }),
		).toBeInTheDocument();
	});

	it("forwards the chosen profession", async () => {
		const filters = makeFilters();
		render(<ProfessionalFiltersSelects filters={filters} />);

		const [profession] = screen.getAllByRole("combobox");
		await userEvent.selectOptions(profession, professions[0]);

		expect(
			(filters as { handleProfessionChange: ReturnType<typeof vi.fn> })
				.handleProfessionChange,
		).toHaveBeenCalledWith(professions[0]);
	});

	it("offers only the specialties available for the profession", () => {
		render(<ProfessionalFiltersSelects filters={makeFilters()} />);

		const [, specialty] = screen.getAllByRole("combobox");
		expect(
			Array.from((specialty as HTMLSelectElement).options).map((o) => o.text),
		).toEqual(["Todas as especialidades", "Cardiologia", "Pediatria"]);
	});

	it("maps 'all specialties' back to an empty filter", async () => {
		const filters = makeFilters({ specialty: "Cardiologia" });
		render(<ProfessionalFiltersSelects filters={filters} />);

		const [, specialty] = screen.getAllByRole("combobox");
		expect(specialty).toHaveValue("Cardiologia");
		await userEvent.selectOptions(specialty, ALL);

		expect(
			(filters as { setSpecialty: ReturnType<typeof vi.fn> }).setSpecialty,
		).toHaveBeenCalledWith("");
	});
});
