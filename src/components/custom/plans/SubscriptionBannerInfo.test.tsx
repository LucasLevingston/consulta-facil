import { render, screen } from "@testing-library/react";
import { CheckCircle2 } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SubscriptionBannerInfo } from "./SubscriptionBannerInfo";

const base = {
	label: "Plano Pro Mensal",
	expiresAtFormatted: "05/12/2026",
	isActive: true,
	isExpiringSoon: false,
	StatusIcon: CheckCircle2,
};

describe("SubscriptionBannerInfo", () => {
	it("shows the current plan and until when it is valid", () => {
		render(<SubscriptionBannerInfo {...base} />);

		expect(screen.getByText("Plano Pro Mensal")).toBeInTheDocument();
		expect(screen.getByText("Válido até 05/12/2026")).toBeInTheDocument();
	});

	it("says when an inactive plan expired", () => {
		render(<SubscriptionBannerInfo {...base} isActive={false} />);

		expect(screen.getByText("Expirou em 05/12/2026")).toBeInTheDocument();
	});

	it("omits the date line when there is no expiry", () => {
		render(<SubscriptionBannerInfo {...base} expiresAtFormatted={null} />);

		expect(screen.queryByText(/Válido até|Expirou em/)).not.toBeInTheDocument();
	});

	it("uses the warning color when the plan is about to expire", () => {
		const { container } = render(
			<SubscriptionBannerInfo {...base} isExpiringSoon />,
		);

		expect(container.querySelector(".bg-yellow-500\\/10")).toBeInTheDocument();
		expect(
			container.querySelector(".bg-green-500\\/10"),
		).not.toBeInTheDocument();
	});
});
