import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";

vi.mock("./use-professional-analytics", () => ({
	useProfessionalAnalytics: vi.fn(),
}));
vi.mock(
	"@/components/analytics/professional-analytics",
	async (importOriginal) => {
		const actual =
			await importOriginal<
				typeof import("@/components/analytics/professional-analytics")
			>();
		return {
			...actual,
			ProfessionalAnalyticsContent: ({
				data,
			}: {
				data: { period: string };
			}) => <p>conteúdo {data.period}</p>,
		};
	},
);

import { ProfessionalAnalyticsView } from "./professional-analytics-view";
import { useProfessionalAnalytics } from "./use-professional-analytics";

const mockUseProfessionalAnalytics = vi.mocked(useProfessionalAnalytics);

describe("ProfessionalAnalyticsView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseProfessionalAnalytics.mockImplementation(
			(period) => ({ data: makeProfessionalAnalytics({ period }) }) as never,
		);
	});

	it("shows the header and the last 30 days by default", () => {
		render(<ProfessionalAnalyticsView />);

		expect(screen.getByText("Analytics")).toBeInTheDocument();
		expect(screen.getByText("conteúdo 30d")).toBeInTheDocument();
		expect(mockUseProfessionalAnalytics).toHaveBeenCalledWith("30d");
	});

	it("reloads the data when another period is picked", async () => {
		render(<ProfessionalAnalyticsView />);

		await userEvent.click(screen.getByRole("button", { name: "12 meses" }));

		expect(await screen.findByText("conteúdo 12m")).toBeInTheDocument();
		expect(mockUseProfessionalAnalytics).toHaveBeenLastCalledWith("12m");
		expect(screen.getByRole("button", { name: "12 meses" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});
});
