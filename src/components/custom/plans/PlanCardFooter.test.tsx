import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlanCardFooter } from "./PlanCardFooter";

describe("PlanCardFooter", () => {
	it("marks the current plan and disables selecting it again", () => {
		render(
			<PlanCardFooter
				isActive
				isPending={false}
				highlight
				onSelect={vi.fn()}
			/>,
		);

		expect(screen.getByRole("button", { name: /Plano atual/ })).toBeDisabled();
		expect(
			screen.queryByRole("button", { name: /Assinar agora/ }),
		).not.toBeInTheDocument();
	});

	it("subscribes when another plan is selected", async () => {
		const onSelect = vi.fn();
		render(
			<PlanCardFooter
				isActive={false}
				isPending={false}
				highlight={false}
				onSelect={onSelect}
			/>,
		);

		await userEvent.click(
			screen.getByRole("button", { name: /Assinar agora/ }),
		);

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it("blocks double submits while the checkout is being created", () => {
		render(
			<PlanCardFooter
				isActive={false}
				isPending
				highlight={false}
				onSelect={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("button", { name: /Assinar agora/ }),
		).toBeDisabled();
	});
});
