import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	updateAddressSchema: {},
}));
vi.mock("./use-update-address", () => ({
	useUpdateAddress: vi.fn(),
}));

import { toast } from "sonner";
import { useAddressForm } from "./use-address-form";
import { useUpdateAddress } from "./use-update-address";

const mockUpdateAddress = vi.mocked(useUpdateAddress);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useAddressForm", () => {
	const professional = {
		id: "p-1",
		city: "São Paulo",
		state: "SP",
		address: "Rua A",
		zipCode: "01000-000",
		neighborhood: "Centro",
		streetNumber: "100",
		complement: "",
	};

	beforeEach(() => {
		mockUpdateAddress.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia o form com os valores do profissional", () => {
		const { result } = renderHook(() => useAddressForm(professional as never), {
			wrapper: wrapper(),
		});
		expect(result.current.form.getValues("city")).toBe("São Paulo");
		expect(result.current.form.getValues("neighborhood")).toBe("Centro");
	});

	it("reseta o form quando o profissional muda", () => {
		const { result, rerender } = renderHook(
			(props: { professional: typeof professional }) =>
				useAddressForm(props.professional as never),
			{ wrapper: wrapper(), initialProps: { professional } },
		);
		expect(result.current.form.getValues("city")).toBe("São Paulo");
		const updated = { ...professional, city: "Rio de Janeiro" };
		rerender({ professional: updated });
		expect(result.current.form.getValues("city")).toBe("Rio de Janeiro");
	});

	it("onSubmit converte strings vazias para null e chama mutate com toast de sucesso", () => {
		const mutate = vi.fn((_data, opts) => opts?.onSuccess?.());
		mockUpdateAddress.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useAddressForm(professional as never), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.onSubmit({ ...professional, complement: "" } as never);
		});
		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({ complement: null }),
			expect.any(Object),
		);
		expect(toast.success).toHaveBeenCalledWith("Endereço atualizado!");
	});

	it("onSubmit mostra toast de erro quando a mutation falha", () => {
		const mutate = vi.fn((_data, opts) => opts?.onError?.());
		mockUpdateAddress.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useAddressForm(professional as never), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.onSubmit(professional as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar endereço.");
	});

	it("isPending reflete o estado da mutation", () => {
		mockUpdateAddress.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useAddressForm(professional as never), {
			wrapper: wrapper(),
		});
		expect(result.current.isPending).toBe(true);
	});
});
