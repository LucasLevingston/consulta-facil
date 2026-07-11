import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ replace: vi.fn() })),
	useSearchParams: vi.fn(() => ({ get: vi.fn(() => "test-token") })),
}));
vi.mock("@/components/auth/use-magic-link-verify", () => ({
	useMagicLinkVerify: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/auth/VerifyStatusIcon", () => ({
	VerifyStatusIcon: ({
		isLoading,
		isSuccess,
	}: {
		isLoading: boolean;
		isSuccess: boolean;
	}) => (
		<span data-testid="status-icon">
			{isLoading ? "loading" : isSuccess ? "success" : "error"}
		</span>
	),
}));

import { useMagicLinkVerify } from "@/components/auth/use-magic-link-verify";
import VerifyContent from "@/components/auth/VerifyContent";

const mockVerify = vi.mocked(useMagicLinkVerify);

describe("VerifyContent", () => {
	it("shows 'Verificando link...' when loading", () => {
		mockVerify.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: true,
			isError: false,
			isSuccess: false,
		} as never);
		render(<VerifyContent />);
		expect(screen.getByText("Verificando link...")).toBeInTheDocument();
	});

	it("shows 'Autenticado!' when success", () => {
		mockVerify.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
			isError: false,
			isSuccess: true,
		} as never);
		render(<VerifyContent />);
		expect(screen.getByText("Autenticado!")).toBeInTheDocument();
	});

	it("shows 'Link inválido' when error", () => {
		mockVerify.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("bad")),
			isPending: false,
			isError: true,
			isSuccess: false,
		} as never);
		render(<VerifyContent />);
		expect(screen.getByText("Link inválido")).toBeInTheDocument();
	});
});
