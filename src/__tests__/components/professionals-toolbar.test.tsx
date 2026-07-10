import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/custom/professional/ProfessionalFilters", () => ({
	default: () => <div>professional-filters</div>,
}));
vi.mock(
	"@/components/custom/professionals-content/ProfessionalsNearbyControl",
	() => ({
		ProfessionalsNearbyControl: () => <div>nearby-control</div>,
	}),
);
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	),
}));

import { ProfessionalsToolbar } from "@/components/custom/professionals-content";

const base = {
	viewMode: "list" as const,
	isNearbyMode: false,
	radiusKm: 10,
	locationLoading: false,
	radiusOptions: [],
	onSetRadiusKm: vi.fn(),
	onClearLocation: vi.fn(),
	onRequestLocation: vi.fn(),
	onSetViewMode: vi.fn(),
};

describe("ProfessionalsToolbar", () => {
	it("renders ProfessionalFilters", () => {
		render(<ProfessionalsToolbar {...base} />);
		expect(screen.getByText("professional-filters")).toBeInTheDocument();
	});

	it("renders NearbyControl", () => {
		render(<ProfessionalsToolbar {...base} />);
		expect(screen.getByText("nearby-control")).toBeInTheDocument();
	});

	it("calls onSetViewMode with 'map' when map button clicked", async () => {
		const onSetViewMode = vi.fn();
		render(<ProfessionalsToolbar {...base} onSetViewMode={onSetViewMode} />);
		const buttons = screen.getAllByRole("button");
		const mapBtn =
			buttons.find((b) => b.querySelector("svg")) ??
			buttons[buttons.length - 1];
		await userEvent.click(mapBtn);
		expect(onSetViewMode).toHaveBeenCalled();
	});
});
