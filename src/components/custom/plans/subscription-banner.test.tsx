import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscriptionBanner } from "./subscription-banner";

function makeSubscription(overrides = {}) {
	return {
		planId: "monthly",
		status: "ACTIVE",
		expiresAt: null,
		...overrides,
	};
}

describe("SubscriptionBanner", () => {
	it("renders plan label for monthly", () => {
		render(<SubscriptionBanner subscription={makeSubscription() as never} />);
		expect(screen.getByText("Pro Mensal")).toBeInTheDocument();
	});

	it("renders plan label for yearly", () => {
		render(
			<SubscriptionBanner
				subscription={makeSubscription({ planId: "yearly" }) as never}
			/>,
		);
		expect(screen.getByText("Pro Anual")).toBeInTheDocument();
	});

	it("renders ACTIVE status badge", () => {
		render(<SubscriptionBanner subscription={makeSubscription() as never} />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("renders PENDING status badge", () => {
		render(
			<SubscriptionBanner
				subscription={makeSubscription({ status: "PENDING" }) as never}
			/>,
		);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("renders CANCELLED status badge", () => {
		render(
			<SubscriptionBanner
				subscription={makeSubscription({ status: "CANCELLED" }) as never}
			/>,
		);
		expect(screen.getByText("Cancelado")).toBeInTheDocument();
	});

	it("renders EXPIRED status badge", () => {
		render(
			<SubscriptionBanner
				subscription={makeSubscription({ status: "EXPIRED" }) as never}
			/>,
		);
		expect(screen.getByText("Expirado")).toBeInTheDocument();
	});

	it("shows expiresAt when provided", () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 30);
		render(
			<SubscriptionBanner
				subscription={
					makeSubscription({ expiresAt: futureDate.toISOString() }) as never
				}
			/>,
		);
		expect(screen.getByText(/Válido até/)).toBeInTheDocument();
	});

	it("shows expiration warning when expires soon (<=7 days)", () => {
		const soonDate = new Date();
		soonDate.setDate(soonDate.getDate() + 3);
		render(
			<SubscriptionBanner
				subscription={
					makeSubscription({ expiresAt: soonDate.toISOString() }) as never
				}
			/>,
		);
		expect(screen.getByText(/Expira em/)).toBeInTheDocument();
	});

	it("shows progress bar when ACTIVE", () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 100);
		const { container } = render(
			<SubscriptionBanner
				subscription={
					makeSubscription({ expiresAt: futureDate.toISOString() }) as never
				}
			/>,
		);
		expect(
			container.querySelector("[class*='rounded-full'][style]"),
		).toBeInTheDocument();
	});

	it("shows 'Plano atual' label", () => {
		render(<SubscriptionBanner subscription={makeSubscription() as never} />);
		expect(screen.getByText("Plano atual")).toBeInTheDocument();
	});
});
