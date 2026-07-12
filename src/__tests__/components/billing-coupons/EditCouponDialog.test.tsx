import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", async () => {
	const schema = await import("@/lib/schemas/billing/coupon.schema");
	return {
		updateCouponSchema: schema.updateCouponSchema,
	};
});

vi.mock("@/components/billing/coupons/use-admin-update-coupon", () => ({
	useAdminUpdateCoupon: vi.fn(),
}));

vi.mock("@/components/ui/dialog", async () => {
	const { createContext, useContext } = await import("react");
	const DialogCtx = createContext<{
		open: boolean;
		onOpenChange: (v: boolean) => void;
	}>({ open: false, onOpenChange: () => {} });

	return {
		Dialog: ({
			children,
			open,
			onOpenChange,
		}: {
			children: React.ReactNode;
			open: boolean;
			onOpenChange: (v: boolean) => void;
		}) => (
			<DialogCtx.Provider value={{ open, onOpenChange }}>
				<div data-testid="dialog-root" data-open={open}>
					{children}
				</div>
			</DialogCtx.Provider>
		),
		DialogTrigger: ({ children }: { children: React.ReactNode }) => {
			const { onOpenChange } = useContext(DialogCtx);
			return (
				// biome-ignore lint/a11y/useKeyWithClickEvents: mock trigger for tests
				// biome-ignore lint/a11y/noStaticElementInteractions: mock trigger for tests
				<span onClick={() => onOpenChange(true)}>{children}</span>
			);
		},
		DialogContent: ({ children }: { children: React.ReactNode }) => {
			const { open } = useContext(DialogCtx);
			return open ? <div>{children}</div> : null;
		},
		DialogHeader: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		DialogTitle: ({ children }: { children: React.ReactNode }) => (
			<h2>{children}</h2>
		),
	};
});

import { EditCouponDialog } from "@/components/billing/coupons/EditCouponDialog";
import { useAdminUpdateCoupon } from "@/components/billing/coupons/use-admin-update-coupon";
import type { CouponResponse } from "@/lib/schemas/billing/coupon.schema";

const mockUseAdminUpdateCoupon = vi.mocked(useAdminUpdateCoupon);

function buildCoupon(overrides: Partial<CouponResponse> = {}): CouponResponse {
	return {
		id: "coupon-1",
		code: "PROMO10",
		description: "Cupom de boas vindas",
		type: "PERCENT",
		value: 10,
		maxUses: 100,
		currentUses: 5,
		maxUsesPerUser: 1,
		startsAt: null,
		expiresAt: "2026-12-31T00:00:00.000Z",
		applicablePlanIds: null,
		sellerId: null,
		status: "ACTIVE",
		createdBy: null,
		createdAt: null,
		...overrides,
	} as CouponResponse;
}

describe("EditCouponDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAdminUpdateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("não exibe o conteúdo do dialog antes de ser aberto", () => {
		render(<EditCouponDialog coupon={buildCoupon()} />);
		expect(
			screen.queryByText("Editar Cupom — PROMO10"),
		).not.toBeInTheDocument();
	});

	it("abre o dialog ao clicar em Editar e exibe o código do cupom no título", async () => {
		render(<EditCouponDialog coupon={buildCoupon({ code: "XYZ" })} />);
		await userEvent.click(screen.getByRole("button", { name: "Editar" }));
		expect(
			screen.getByRole("heading", { name: "Editar Cupom — XYZ" }),
		).toBeInTheDocument();
	});

	it("preenche a descrição e chama update.mutate com id e dados corretos ao enviar", async () => {
		const mockMutate = vi.fn();
		mockUseAdminUpdateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		} as never);
		render(<EditCouponDialog coupon={buildCoupon({ id: "coupon-77" })} />);
		await userEvent.click(screen.getByRole("button", { name: "Editar" }));

		const description = screen.getByLabelText("Descrição");
		await userEvent.clear(description);
		await userEvent.type(description, "Nova descrição");

		await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

		expect(mockMutate).toHaveBeenCalledWith(
			{
				id: "coupon-77",
				data: expect.objectContaining({ description: "Nova descrição" }),
			},
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		);
	});

	it("fecha o dialog quando a atualização tem sucesso", async () => {
		const mockMutate = vi.fn();
		mockUseAdminUpdateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		} as never);
		render(<EditCouponDialog coupon={buildCoupon()} />);
		await userEvent.click(screen.getByRole("button", { name: "Editar" }));
		await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

		const [, options] = mockMutate.mock.calls[0];
		act(() => {
			options.onSuccess();
		});

		expect(
			screen.queryByRole("heading", { name: /Editar Cupom/ }),
		).not.toBeInTheDocument();
	});

	it("exibe Salvando... e desabilita o botão de envio quando isPending é true", async () => {
		mockUseAdminUpdateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		render(<EditCouponDialog coupon={buildCoupon()} />);
		await userEvent.click(screen.getByRole("button", { name: "Editar" }));
		expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
	});
});
