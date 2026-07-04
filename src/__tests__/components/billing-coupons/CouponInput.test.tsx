import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", () => ({
	useValidateCoupon: vi.fn(),
}));

import { CouponInput } from "@/components/coupon/CouponInput";
import { useValidateCoupon } from "@/features/billing";

const mockUseValidateCoupon = vi.mocked(useValidateCoupon);

describe("CouponInput", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o input com o placeholder Codigo do cupom", () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			data: undefined,
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		expect(screen.getByPlaceholderText("Codigo do cupom")).toBeInTheDocument();
	});

	it("mantém o botão Validar desabilitado quando o código está vazio", () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			data: undefined,
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		expect(screen.getByRole("button", { name: "Validar" })).toBeDisabled();
	});

	it("habilita o botão Validar e converte o código para maiúsculas ao digitar", async () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			data: undefined,
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		const input = screen.getByPlaceholderText("Codigo do cupom");
		await userEvent.type(input, "promo10");
		expect(input).toHaveValue("PROMO10");
		expect(screen.getByRole("button", { name: "Validar" })).not.toBeDisabled();
	});

	it("chama validate.mutate com code, userId e amount corretos ao clicar em Validar", async () => {
		const mockMutate = vi.fn();
		mockUseValidateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
			data: undefined,
		} as never);
		render(<CouponInput amount={250} userId="user-9" />);
		const input = screen.getByPlaceholderText("Codigo do cupom");
		await userEvent.type(input, "descontao");
		await userEvent.click(screen.getByRole("button", { name: "Validar" }));
		expect(mockMutate).toHaveBeenCalledWith(
			{ code: "DESCONTAO", userId: "user-9", amount: 250 },
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		);
	});

	it("chama onApply com o resultado quando a validação tem sucesso", async () => {
		const onApply = vi.fn();
		const result = {
			valid: true,
			discountAmount: 10,
			finalAmount: 90,
			message: "Cupom aplicado",
		};
		const mockMutate = vi.fn((_input, options) => {
			options?.onSuccess?.(result);
		});
		mockUseValidateCoupon.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
			data: undefined,
		} as never);
		render(<CouponInput amount={100} userId="user-1" onApply={onApply} />);
		const input = screen.getByPlaceholderText("Codigo do cupom");
		await userEvent.type(input, "promo");
		await userEvent.click(screen.getByRole("button", { name: "Validar" }));
		expect(onApply).toHaveBeenCalledWith(result);
	});

	it("exibe Validando... e desabilita o botão quando a validação está pendente", () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
			data: undefined,
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		expect(screen.getByRole("button", { name: "Validando..." })).toBeDisabled();
	});

	it("exibe a mensagem de desconto em verde quando o cupom é válido", () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			data: {
				valid: true,
				discountAmount: 20,
				finalAmount: 80,
				message: "Cupom aplicado",
			},
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		const message = screen.getByText(/Desconto: R\$ 20,00/);
		expect(message).toBeInTheDocument();
		expect(message).toHaveClass("text-green-600");
	});

	it("exibe a mensagem de erro quando o cupom é inválido", () => {
		mockUseValidateCoupon.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
			data: {
				valid: false,
				discountAmount: 0,
				finalAmount: 100,
				message: "Cupom expirado",
			},
		} as never);
		render(<CouponInput amount={100} userId="user-1" />);
		const message = screen.getByText("Cupom expirado");
		expect(message).toHaveClass("text-destructive");
	});
});
