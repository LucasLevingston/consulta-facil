import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./use-system-fees", () => ({
	useSystemFees: vi.fn(),
}));
vi.mock("./use-update-system-fee", () => ({
	useUpdateSystemFee: vi.fn(),
}));

import { useSystemFees } from "./use-system-fees";
import { useSystemFeesPage } from "./use-system-fees-page";
import { useUpdateSystemFee } from "./use-update-system-fee";

const mockUseSystemFees = vi.mocked(useSystemFees);
const mockUseUpdateSystemFee = vi.mocked(useUpdateSystemFee);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useSystemFeesPage", () => {
	const fee = { id: "f-1", fixedFee: 10, percentageFee: 5 };

	beforeEach(() => {
		mockUseSystemFees.mockReturnValue({
			data: [fee],
			isLoading: false,
		} as never);
		mockUseUpdateSystemFee.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia sem edição e campos vazios", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		expect(result.current.editing).toBeNull();
		expect(result.current.fixedFee).toBe("");
		expect(result.current.percentageFee).toBe("");
		expect(result.current.fees).toEqual([fee]);
	});

	it("startEdit preenche os campos com os valores da taxa selecionada", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		expect(result.current.editing).toBe("f-1");
		expect(result.current.fixedFee).toBe("10");
		expect(result.current.percentageFee).toBe("5");
	});

	it("handleSave chama a mutation com os valores numéricos e limpa a edição ao concluir", () => {
		const mutate = vi.fn((_data, opts) => opts?.onSuccess?.());
		mockUseUpdateSystemFee.mockReturnValue({
			mutate,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		act(() => result.current.setFixedFee("20"));
		act(() => result.current.setPercentageFee("8"));
		act(() => result.current.handleSave("f-1"));
		expect(mutate).toHaveBeenCalledWith(
			{ id: "f-1", data: { fixedFee: 20, percentageFee: 8 } },
			expect.any(Object),
		);
		expect(result.current.editing).toBeNull();
	});

	it("cancelEdit limpa a edição em andamento", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		act(() => result.current.cancelEdit());
		expect(result.current.editing).toBeNull();
	});

	it("saving reflete o estado da mutation", () => {
		mockUseUpdateSystemFee.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useSystemFeesPage());
		expect(result.current.saving).toBe(true);
	});
});
