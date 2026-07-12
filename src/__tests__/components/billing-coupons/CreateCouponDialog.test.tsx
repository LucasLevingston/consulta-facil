import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", async () => {
	const schema = await import("@/lib/schemas/billing/coupon.schema");
	return {
		createCouponSchema: schema.createCouponSchema,
	};
});

vi.mock("@/components/billing/coupons/use-admin-create-coupon", () => ({
	useAdminCreateCoupon: vi.fn(),
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

import { CreateCouponDialog } from "@/components/billing/coupons/CreateCouponDialog";
import { useAdminCreateCoupon } from "@/components/billing/coupons/use-admin-create-coupon";

const mockUseAdminCreateCoupon = vi.mocked(useAdminCreateCoupon);

describe("CreateCouponDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAdminCreateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("não exibe o conteúdo do dialog antes de ser aberto", () => {
		render(<CreateCouponDialog />);
		expect(
			screen.queryByRole("heading", { name: "Criar Cupom" }),
		).not.toBeInTheDocument();
	});

	it("abre o dialog ao clicar em Novo Cupom", async () => {
		render(<CreateCouponDialog />);
		await userEvent.click(screen.getByRole("button", { name: /Novo Cupom/ }));
		expect(
			screen.getByRole("heading", { name: "Criar Cupom" }),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Código")).toBeInTheDocument();
		expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
	});

	it("preenche os campos e chama create.mutate com os dados corretos ao enviar", async () => {
		const mockMutate = vi.fn();
		mockUseAdminCreateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		} as never);
		render(<CreateCouponDialog />);
		await userEvent.click(screen.getByRole("button", { name: /Novo Cupom/ }));

		await userEvent.type(screen.getByLabelText("Código"), "promo5");
		await userEvent.type(screen.getByLabelText("Descrição"), "Cupom de teste");
		await userEvent.type(screen.getByLabelText("Valor"), "50");

		await userEvent.click(screen.getByRole("button", { name: "Criar Cupom" }));

		expect(mockMutate).toHaveBeenCalledWith(
			expect.objectContaining({
				code: "PROMO5",
				description: "Cupom de teste",
				type: "PERCENT",
				value: 50,
				maxUsesPerUser: 1,
			}),
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		);
	});

	it("fecha o dialog quando a criação tem sucesso", async () => {
		const mockMutate = vi.fn();
		mockUseAdminCreateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		} as never);
		render(<CreateCouponDialog />);
		await userEvent.click(screen.getByRole("button", { name: /Novo Cupom/ }));
		await userEvent.type(screen.getByLabelText("Código"), "promo5");
		await userEvent.type(screen.getByLabelText("Valor"), "50");
		await userEvent.click(screen.getByRole("button", { name: "Criar Cupom" }));

		const [, options] = mockMutate.mock.calls[0];
		act(() => {
			options.onSuccess();
		});

		expect(
			screen.queryByRole("heading", { name: "Criar Cupom" }),
		).not.toBeInTheDocument();
	});

	it("exibe Criando... e desabilita o botão de envio quando isPending é true", async () => {
		mockUseAdminCreateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		render(<CreateCouponDialog />);
		await userEvent.click(screen.getByRole("button", { name: /Novo Cupom/ }));
		expect(screen.getByRole("button", { name: "Criando..." })).toBeDisabled();
	});
});
