import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscriptionStatusBadges } from "./SubscriptionStatusBadges";

describe("SubscriptionStatusBadges", () => {
	it.each([
		["ACTIVE", "Ativo"],
		["PENDING", "Pendente"],
		["CANCELLED", "Cancelado"],
		["EXPIRED", "Expirado"],
	])("translates %s to %s", (status, label) => {
		render(
			<SubscriptionStatusBadges
				status={status}
				isExpiringSoon={false}
				daysRemaining={null}
			/>,
		);

		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it("falls back to the raw status with the expired style", () => {
		render(
			<SubscriptionStatusBadges
				status="PAUSED"
				isExpiringSoon={false}
				daysRemaining={null}
			/>,
		);

		expect(screen.getByText("PAUSED")).toHaveClass("text-zinc-600");
	});

	it.each([
		[0, "Expira em hoje"],
		[1, "Expira em 1 dia"],
		[5, "Expira em 5 dias"],
	])("warns when expiring in %i day(s)", (days, text) => {
		render(
			<SubscriptionStatusBadges
				status="ACTIVE"
				isExpiringSoon
				daysRemaining={days}
			/>,
		);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("does not warn when the plan is not close to expiring", () => {
		render(
			<SubscriptionStatusBadges
				status="ACTIVE"
				isExpiringSoon={false}
				daysRemaining={20}
			/>,
		);

		expect(screen.queryByText(/Expira em/)).not.toBeInTheDocument();
	});
});
