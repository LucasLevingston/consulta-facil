import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-breadcrumbs", () => ({
	useBreadcrumbs: vi.fn(),
}));

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

const mockUseBreadcrumbs = vi.mocked(useBreadcrumbs);

describe("Breadcrumbs", () => {
	it("renders nothing when no items", () => {
		mockUseBreadcrumbs.mockReturnValue([]);
		const { container } = render(<Breadcrumbs />);
		expect(container.firstChild).toBeNull();
	});

	it("renders last item as page (not link)", () => {
		mockUseBreadcrumbs.mockReturnValue([
			{ title: "Dashboard", link: "/dashboard" },
		]);
		render(<Breadcrumbs />);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
	});

	it("renders multiple breadcrumb items", () => {
		mockUseBreadcrumbs.mockReturnValue([
			{ title: "Dashboard", link: "/dashboard" },
			{ title: "Consultas", link: "/dashboard/appointments" },
		]);
		render(<Breadcrumbs />);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Consultas")).toBeInTheDocument();
	});

	it("renders link for non-last items", () => {
		mockUseBreadcrumbs.mockReturnValue([
			{ title: "Dashboard", link: "/dashboard" },
			{ title: "Consultas", link: "/dashboard/appointments" },
		]);
		render(<Breadcrumbs />);
		const link = screen.getByRole("link", { name: "Dashboard" });
		expect(link).toHaveAttribute("href", "/dashboard");
	});
});
