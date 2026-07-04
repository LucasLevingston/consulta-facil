import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CouponsTable } from "@/components/billing/coupons/CouponsTable";
import type { CouponResponse } from "@/features/billing";

vi.mock("@/components/billing/coupons/EditCouponDialog", () => ({
	EditCouponDialog: ({ coupon }: { coupon: CouponResponse }) => (
		<button type="button">Editar-mock-{coupon.code}</button>
	),
}));

import { vi } from "vitest";

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

describe("CouponsTable", () => {
	it("exibe mensagem de lista vazia quando nao ha cupons", () => {
		render(<CouponsTable coupons={[]} />);
		expect(screen.getByText("Nenhum cupom cadastrado.")).toBeInTheDocument();
	});

	it("renderiza uma linha para cada cupom da lista", () => {
		const coupons = [
			buildCoupon({ id: "c1", code: "A" }),
			buildCoupon({ id: "c2", code: "B" }),
		];
		render(<CouponsTable coupons={coupons} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("exibe o codigo do cupom", () => {
		render(<CouponsTable coupons={[buildCoupon({ code: "DESCONTO20" })]} />);
		expect(screen.getByText("DESCONTO20")).toBeInTheDocument();
	});

	it("formata o valor como porcentagem quando tipo e PERCENT", () => {
		render(
			<CouponsTable coupons={[buildCoupon({ type: "PERCENT", value: 15 })]} />,
		);
		expect(screen.getByText("15%")).toBeInTheDocument();
	});

	it("formata o valor em BRL quando tipo e FIXED", () => {
		render(
			<CouponsTable coupons={[buildCoupon({ type: "FIXED", value: 25 })]} />,
		);
		expect(screen.getByText("R$ 25,00")).toBeInTheDocument();
	});

	it("exibe usos atuais e maximo quando maxUses esta definido", () => {
		render(
			<CouponsTable coupons={[buildCoupon({ currentUses: 3, maxUses: 10 })]} />,
		);
		expect(screen.getByText("3 / 10")).toBeInTheDocument();
	});

	it("exibe apenas usos atuais quando maxUses e nulo", () => {
		render(
			<CouponsTable
				coupons={[buildCoupon({ currentUses: 7, maxUses: null })]}
			/>,
		);
		expect(screen.getByText("7")).toBeInTheDocument();
	});

	it("exibe travessao quando nao ha data de expiracao", () => {
		render(<CouponsTable coupons={[buildCoupon({ expiresAt: null })]} />);
		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("exibe o rotulo Ativo para status ACTIVE", () => {
		render(<CouponsTable coupons={[buildCoupon({ status: "ACTIVE" })]} />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("exibe o rotulo Expirado para status EXPIRED", () => {
		render(<CouponsTable coupons={[buildCoupon({ status: "EXPIRED" })]} />);
		expect(screen.getByText("Expirado")).toBeInTheDocument();
	});

	it("renderiza o EditCouponDialog para cada cupom", () => {
		render(<CouponsTable coupons={[buildCoupon({ code: "XYZ" })]} />);
		expect(screen.getByText("Editar-mock-XYZ")).toBeInTheDocument();
	});
});
