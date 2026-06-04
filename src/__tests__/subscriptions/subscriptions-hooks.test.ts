import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/subscriptions/get-my-subscription.api", () => ({
	getMySubscriptionApi: vi.fn(),
}));
vi.mock("@/lib/api/subscriptions/create-checkout.api", () => ({
	createCheckoutApi: vi.fn(),
}));

import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { createCheckoutApi } from "@/lib/api/subscriptions/create-checkout.api";
import { getMySubscriptionApi } from "@/lib/api/subscriptions/get-my-subscription.api";

const mockGetMySubscription = vi.mocked(getMySubscriptionApi);
const mockCreateCheckout = vi.mocked(createCheckoutApi);

const subscription = { id: "sub-1", status: "ACTIVE", planId: "plan-1" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMySubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches my subscription", async () => {
		mockGetMySubscription.mockResolvedValueOnce(subscription as never);
		const { result } = renderHook(() => useMySubscription(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscription);
	});

	it("isLoading initially", () => {
		mockGetMySubscription.mockResolvedValueOnce(subscription as never);
		const { result } = renderHook(() => useMySubscription(), {
			wrapper: wrapper(),
		});
		expect(result.current.isLoading).toBe(true);
	});
});

describe("useCreateCheckout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});
	});

	it("calls createCheckoutApi with planId", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("plan-pro");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreateCheckout).toHaveBeenCalledWith("plan-pro");
	});

	it("redirects to checkoutUrl on success", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("plan-pro");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(window.location.href).toBe("https://pay.example.com/checkout");
	});
});
