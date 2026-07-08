import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Plans from "@/components/custom/plans/Plans";
import type { PlanResponse } from "@/features/plans";

const mutate = vi.fn();

function makePlan(overrides: Partial<PlanResponse> = {}): PlanResponse {
	return {
		id: "p1",
		slug: "starter",
		name: "Starter",
		description: "Plano inicial",
		tier: "STARTER",
		billingPeriod: "MONTHLY",
		price: 99,
		frequency: 1,
		frequencyType: "months",
		features: ["Recurso A"],
		maxAppointments: 30,
		status: "ACTIVE",
		displayOrder: 1,
		...overrides,
	};
}

vi.mock("@/features/plans", () => ({
	usePlans: vi.fn(() => ({ data: [], isLoading: false, error: null })),
}));

vi.mock("@/features/subscriptions", () => ({
	useCreateCheckout: vi.fn(() => ({ mutate, isPending: false })),
	useMySubscription: vi.fn(() => ({
		data: null,
		isLoading: false,
		error: null,
	})),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import { usePlans } from "@/features/plans";
import { useMySubscription } from "@/features/subscriptions";

describe("Plans", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lista os planos ordenados por displayOrder", () => {
		vi.mocked(usePlans).mockReturnValueOnce({
			data: [
				makePlan({ slug: "pro", name: "Pro", displayOrder: 2 }),
				makePlan({ slug: "free", name: "Free", price: 0, displayOrder: 1 }),
			],
			isLoading: false,
			error: null,
		} as never);
		render(<Plans />);
		const titles = screen.getAllByText(/Free|Pro/).map((el) => el.textContent);
		expect(titles.indexOf("Free")).toBeLessThan(titles.indexOf("Pro"));
	});

	it("exibe o banner de assinatura quando existe assinatura ativa não expirada", () => {
		vi.mocked(usePlans).mockReturnValueOnce({
			data: [makePlan()],
			isLoading: false,
			error: null,
		} as never);
		vi.mocked(useMySubscription).mockReturnValueOnce({
			data: {
				id: "sub1",
				planId: "starter",
				status: "ACTIVE",
				expiresAt: null,
				createdAt: new Date().toISOString(),
			},
			isLoading: false,
			error: null,
		} as never);
		render(<Plans />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("chama checkout.mutate com o planId ao assinar um plano pago", async () => {
		vi.mocked(usePlans).mockReturnValueOnce({
			data: [makePlan({ slug: "starter", name: "Starter" })],
			isLoading: false,
			error: null,
		} as never);
		render(<Plans />);
		await userEvent.click(screen.getByText("Assinar agora"));
		expect(mutate).toHaveBeenCalledWith(
			"starter",
			expect.objectContaining({ onError: expect.any(Function) }),
		);
	});

	it("não chama checkout.mutate ao clicar no plano gratuito", async () => {
		vi.mocked(usePlans).mockReturnValueOnce({
			data: [makePlan({ slug: "free", name: "Free", price: 0 })],
			isLoading: false,
			error: null,
		} as never);
		render(<Plans />);
		await userEvent.click(screen.getByText("Assinar agora"));
		expect(mutate).not.toHaveBeenCalled();
	});
});
