import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("@/features/professionals", () => ({
	updateSocialLinksSchema: {},
	useUpdateSocialLinks: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { useSocialLinksForm } from "@/components/professionals/social-links-form";
import { useUpdateSocialLinks } from "@/features/professionals";

const mockUseUpdate = vi.mocked(useUpdateSocialLinks);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

const professional = {
	instagramUrl: "https://instagram.com/test",
	linkedinUrl: null,
	websiteUrl: null,
	facebookUrl: null,
};

beforeEach(() => {
	vi.clearAllMocks();
	mockUseUpdate.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("useSocialLinksForm", () => {
	it("returns form, isPending and onSubmit", () => {
		const { result } = renderHook(
			() => useSocialLinksForm({ professional: professional as never }),
			{ wrapper: wrapper() },
		);
		expect(result.current.form).toBeDefined();
		expect(result.current.isPending).toBe(false);
		expect(typeof result.current.onSubmit).toBe("function");
	});

	it("reflects mutation isPending state", () => {
		mockUseUpdate.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(
			() => useSocialLinksForm({ professional: professional as never }),
			{ wrapper: wrapper() },
		);
		expect(result.current.isPending).toBe(true);
	});

	it("initializes form with professional data", () => {
		const { result } = renderHook(
			() => useSocialLinksForm({ professional: professional as never }),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("instagramUrl")).toBe(
			"https://instagram.com/test",
		);
	});

	it("defaults null fields to empty string", () => {
		const { result } = renderHook(
			() => useSocialLinksForm({ professional: professional as never }),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("linkedinUrl")).toBe("");
	});
});
