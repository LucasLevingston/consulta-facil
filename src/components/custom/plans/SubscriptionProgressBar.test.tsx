import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscriptionProgressBar } from "./SubscriptionProgressBar";

describe("SubscriptionProgressBar", () => {
	it("fills the bar to the given percentage with the given color", () => {
		const { container } = render(
			<SubscriptionProgressBar
				progressPercent={42}
				progressColor="bg-green-500"
				daysRemaining={null}
			/>,
		);

		const fill = container.querySelector(".bg-green-500");
		expect(fill).toHaveStyle({ width: "42%" });
	});

	it.each([
		[1, "1 dia restante"],
		[0, "0 dias restantes"],
		[12, "12 dias restantes"],
	])("shows %i as '%s'", (days, text) => {
		render(
			<SubscriptionProgressBar
				progressPercent={50}
				progressColor="bg-green-500"
				daysRemaining={days}
			/>,
		);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("hides the remaining days when unknown", () => {
		render(
			<SubscriptionProgressBar
				progressPercent={50}
				progressColor="bg-green-500"
				daysRemaining={null}
			/>,
		);

		expect(screen.queryByText(/restante/)).not.toBeInTheDocument();
	});
});
