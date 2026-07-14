import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Plan } from "@/components/custom/plans/types";
import { PlanCard } from "./plan-card";

const plan: Plan = {
	id: "monthly",
	title: "Pro Mensal",
	monthlyEquiv: "149,90",
	totalPrice: "149,90",
	period: "/mês",
	description: "Acesso completo à plataforma.",
	icon: null,
	features: ["Consultas ilimitadas", "Dashboard completo"],
};

const yearlyPlan: Plan = {
	...plan,
	id: "yearly",
	title: "Pro Anual",
	period: "/ano",
	totalPrice: "1.618,92",
	highlight: true,
};

describe("PlanCard", () => {
	it("renders plan title", () => {
		render(
			<PlanCard
				plan={plan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Pro Mensal")).toBeInTheDocument();
	});

	it("renders plan description", () => {
		render(
			<PlanCard
				plan={plan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(
			screen.getByText("Acesso completo à plataforma."),
		).toBeInTheDocument();
	});

	it("renders features list", () => {
		render(
			<PlanCard
				plan={plan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Consultas ilimitadas")).toBeInTheDocument();
		expect(screen.getByText("Dashboard completo")).toBeInTheDocument();
	});

	it("calls onSelect with planId when clicked", async () => {
		const onSelect = vi.fn();
		render(
			<PlanCard
				plan={plan}
				subscription={null}
				onSelect={onSelect}
				isPending={false}
			/>,
		);
		await userEvent.click(screen.getByText("Assinar agora"));
		expect(onSelect).toHaveBeenCalledWith("monthly");
	});

	it("shows loading spinner when isPending=true", () => {
		render(
			<PlanCard
				plan={plan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={true}
			/>,
		);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("shows active plan button when subscription matches", () => {
		render(
			<PlanCard
				plan={plan}
				subscription={{ status: "ACTIVE", planId: "monthly" } as never}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Plano atual")).toBeInTheDocument();
	});

	it("shows Mais popular badge for highlight plan", () => {
		render(
			<PlanCard
				plan={yearlyPlan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Mais popular")).toBeInTheDocument();
	});

	it("shows savings badge for yearly plan", () => {
		render(
			<PlanCard
				plan={yearlyPlan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Economize R$ 179,88")).toBeInTheDocument();
	});

	it("shows billed annually text for yearly plan", () => {
		render(
			<PlanCard
				plan={yearlyPlan}
				subscription={null}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText(/Cobrado anualmente/)).toBeInTheDocument();
	});

	it("does not show 'Mais popular' when plan is active", () => {
		render(
			<PlanCard
				plan={yearlyPlan}
				subscription={{ status: "ACTIVE", planId: "yearly" } as never}
				onSelect={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.queryByText("Mais popular")).not.toBeInTheDocument();
		expect(screen.getByText("✓ Plano atual")).toBeInTheDocument();
	});
});
