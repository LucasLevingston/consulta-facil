import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(
	"@/features/subscriptions/repositories/subscriptions.repository",
	() => ({
		subscriptionsRepository: {
			getMy: vi.fn(),
			createCheckout: vi.fn(),
			adminListAll: vi.fn(),
			adminCancel: vi.fn(),
		},
	}),
);

import { subscriptionsRepository } from "@/features/subscriptions/repositories/subscriptions.repository";
import { useCreateCheckout } from "./use-create-checkout";

const mockCreateCheckout = vi.mocked(subscriptionsRepository.createCheckout);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCreateCheckout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});
	});

	it("chama createCheckout com o planId", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("plan-pro");
		});
		expect(mockCreateCheckout).toHaveBeenCalledWith("plan-pro");
	});

	it("redireciona para o checkoutUrl ao ter sucesso", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("plan-pro");
		});
		expect(window.location.href).toBe("https://pay.example.com/checkout");
	});
});
