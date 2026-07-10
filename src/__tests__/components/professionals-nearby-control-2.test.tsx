import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/badge", () => ({
	Badge: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
}));
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		onValueChange,
	}: {
		children: React.ReactNode;
		onValueChange?: (v: string) => void;
	}) => (
		<button type="button" onClick={() => onValueChange?.("20")}>
			{children}
		</button>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => <span />,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import { ProfessionalsNearbyControl } from "@/components/custom/professionals-content";

const radiusOptions = [
	{ value: "5", label: "5 km" },
	{ value: "10", label: "10 km" },
	{ value: "20", label: "20 km" },
];

const base = {
	radiusKm: 10,
	locationLoading: false,
	radiusOptions,
	onSetRadiusKm: vi.fn(),
	onClearLocation: vi.fn(),
	onRequestLocation: vi.fn(),
};

describe("ProfessionalsNearbyControl nearby", () => {
	it("renders 'Perto de você' badge when in nearby mode", () => {
		render(<ProfessionalsNearbyControl {...base} isNearbyMode={true} />);
		expect(screen.getByText(/Perto de você/)).toBeInTheDocument();
	});

	it("renders radius options when in nearby mode", () => {
		render(<ProfessionalsNearbyControl {...base} isNearbyMode={true} />);
		expect(screen.getByText("5 km")).toBeInTheDocument();
		expect(screen.getByText("10 km")).toBeInTheDocument();
	});

	it("calls onClearLocation when X button clicked in nearby mode", async () => {
		const onClearLocation = vi.fn();
		render(
			<ProfessionalsNearbyControl
				{...base}
				isNearbyMode={true}
				onClearLocation={onClearLocation}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		const xButton = buttons[buttons.length - 1];
		await userEvent.click(xButton);
		expect(onClearLocation).toHaveBeenCalledTimes(1);
	});
});
