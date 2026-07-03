import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlanCard } from "@/components/custom/plans/plan-card";
import type { Plan } from "@/components/custom/plans/types";

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
});
