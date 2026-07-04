import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CouponUsagesTable } from "@/components/billing/coupons/CouponUsagesTable";
import type { CouponUsageResponse } from "@/features/billing";

function buildUsage(
	overrides: Partial<CouponUsageResponse> = {},
): CouponUsageResponse {
	return {
		id: "usage-1",
		couponId: "coupon-1",
		couponCode: "PROMO10",
		userId: "user-1234567890",
		paymentId: "payment-1",
		discountAmount: 15,
		usedAt: "2026-05-10T12:00:00.000Z",
		...overrides,
	} as CouponUsageResponse;
}

describe("CouponUsagesTable", () => {
	it("exibe mensagem de lista vazia quando nao ha usos", () => {
		render(<CouponUsagesTable usages={[]} />);
		expect(screen.getByText("Nenhum uso registrado.")).toBeInTheDocument();
	});

	it("renderiza uma linha para cada uso da lista", () => {
		const usages = [buildUsage({ id: "u1" }), buildUsage({ id: "u2" })];
		render(<CouponUsagesTable usages={usages} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("exibe o codigo do cupom quando couponCode esta definido", () => {
		render(
			<CouponUsagesTable usages={[buildUsage({ couponCode: "DESCONTO20" })]} />,
		);
		expect(screen.getByText("DESCONTO20")).toBeInTheDocument();
	});

	it("usa o couponId como fallback quando couponCode e nulo", () => {
		render(
			<CouponUsagesTable
				usages={[buildUsage({ couponCode: null, couponId: "coupon-xyz" })]}
			/>,
		);
		expect(screen.getByText("coupon-xyz")).toBeInTheDocument();
	});

	it("exibe o userId truncado nos primeiros 8 caracteres", () => {
		render(
			<CouponUsagesTable usages={[buildUsage({ userId: "abcdefghijk" })]} />,
		);
		expect(screen.getByText("abcdefgh...")).toBeInTheDocument();
	});

	it("formata o desconto em BRL", () => {
		render(<CouponUsagesTable usages={[buildUsage({ discountAmount: 25 })]} />);
		expect(screen.getByText("R$ 25,00")).toBeInTheDocument();
	});

	it("formata a data de uso no padrao brasileiro", () => {
		render(
			<CouponUsagesTable
				usages={[buildUsage({ usedAt: "2026-01-15T10:00:00.000Z" })]}
			/>,
		);
		expect(screen.getByText("15/01/2026")).toBeInTheDocument();
	});
});
