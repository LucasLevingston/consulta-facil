import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

vi.mock("@/components/admin/PendingApplicationsContent", () => ({
	PendingApplicationsContent: () => <div data-testid="content-stub" />,
}));

import { PendingApplications } from "@/components/admin/PendingApplications";

describe("PendingApplications", () => {
	it("renderiza o título do card", () => {
		render(<PendingApplications />);
		expect(screen.getByText("Solicitações pendentes")).toBeInTheDocument();
	});

	it("renderiza o conteúdo dentro do SuspenseBoundary", () => {
		render(<PendingApplications />);
		expect(screen.getByTestId("content-stub")).toBeInTheDocument();
	});
});
