import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => mockSearchParams,
}));

import { useProfessionalFilters } from "@/components/custom/professional/useProfessionalFilters";

beforeEach(() => {
	vi.clearAllMocks();
	mockSearchParams = new URLSearchParams();
});

describe("useProfessionalFilters", () => {
	it("inicia com valores vazios quando não há parâmetros na URL", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		expect(result.current.name).toBe("");
		expect(result.current.profession).toBe("");
		expect(result.current.specialty).toBe("");
		expect(result.current.serviceTitle).toBe("");
		expect(result.current.state).toBe("");
		expect(result.current.selectedDays).toEqual([]);
		expect(result.current.expanded).toBe(false);
	});

	it("inicia com valores vindos dos parâmetros da URL", () => {
		mockSearchParams = new URLSearchParams(
			"name=Maria&profession=MEDICO&specialty=CARDIOLOGIA&serviceTitle=Botox&state=SP&days=MONDAY,FRIDAY",
		);
		const { result } = renderHook(() => useProfessionalFilters());
		expect(result.current.name).toBe("Maria");
		expect(result.current.profession).toBe("MEDICO");
		expect(result.current.specialty).toBe("CARDIOLOGIA");
		expect(result.current.serviceTitle).toBe("Botox");
		expect(result.current.state).toBe("SP");
		expect(result.current.selectedDays).toEqual(["MONDAY", "FRIDAY"]);
	});

	it("inicia expandido quando há filtros avançados na URL", () => {
		mockSearchParams = new URLSearchParams("state=SP");
		const { result } = renderHook(() => useProfessionalFilters());
		expect(result.current.expanded).toBe(true);
	});

	it("availableSpecialties usa as especialidades da profissão selecionada", () => {
		mockSearchParams = new URLSearchParams("profession=MEDICO");
		const { result } = renderHook(() => useProfessionalFilters());
		expect(result.current.availableSpecialties).toContain("CARDIOLOGIA");
		expect(result.current.availableSpecialties).not.toContain(
			"ODONTOLOGIA_GERAL",
		);
	});

	it("availableSpecialties usa todas as especialidades quando não há profissão selecionada", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		expect(result.current.availableSpecialties.length).toBeGreaterThan(0);
	});

	it("handleProfessionChange define a profissão e limpa a especialidade", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		act(() => {
			result.current.setSpecialty("CARDIOLOGIA");
		});
		act(() => {
			result.current.handleProfessionChange("MEDICO");
		});
		expect(result.current.profession).toBe("MEDICO");
		expect(result.current.specialty).toBe("");
	});

	it("handleProfessionChange com o sentinela ALL limpa a profissão", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		act(() => {
			result.current.handleProfessionChange("MEDICO");
		});
		act(() => {
			result.current.handleProfessionChange("__all__");
		});
		expect(result.current.profession).toBe("");
	});

	it("toggleDay adiciona e remove um dia da seleção", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		act(() => {
			result.current.toggleDay("MONDAY");
		});
		expect(result.current.selectedDays).toEqual(["MONDAY"]);
		act(() => {
			result.current.toggleDay("MONDAY");
		});
		expect(result.current.selectedDays).toEqual([]);
	});

	it("clearAll reseta todos os filtros", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		act(() => {
			result.current.setName("Maria");
			result.current.handleProfessionChange("MEDICO");
			result.current.setServiceTitle("Botox");
			result.current.setState("SP");
			result.current.toggleDay("MONDAY");
		});
		act(() => {
			result.current.clearAll();
		});
		expect(result.current.name).toBe("");
		expect(result.current.profession).toBe("");
		expect(result.current.specialty).toBe("");
		expect(result.current.serviceTitle).toBe("");
		expect(result.current.state).toBe("");
		expect(result.current.selectedDays).toEqual([]);
	});

	it("calcula advancedCount e totalActive a partir dos filtros ativos", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		act(() => {
			result.current.setName("Maria");
			result.current.setState("SP");
			result.current.toggleDay("MONDAY");
		});
		expect(result.current.advancedCount).toBe(2);
		expect(result.current.totalActive).toBe(3);
	});

	it("sincroniza a URL via router.replace quando os filtros mudam (exceto na primeira renderização)", () => {
		const { result } = renderHook(() => useProfessionalFilters());
		expect(mockReplace).not.toHaveBeenCalled();
		act(() => {
			result.current.setName("Maria");
		});
		expect(mockReplace).toHaveBeenCalledWith(
			expect.stringContaining("name=Maria"),
		);
		expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("page=0"));
	});
});
