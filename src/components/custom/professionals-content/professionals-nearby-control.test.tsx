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
	Select: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
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

import { ProfessionalsNearbyControl } from "./ProfessionalsNearbyControl";

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

describe("ProfessionalsNearbyControl not-nearby", () => {
	it("renders 'Perto de mim' button when not in nearby mode", () => {
		render(<ProfessionalsNearbyControl {...base} isNearbyMode={false} />);
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});

	it("calls onRequestLocation when 'Perto de mim' clicked", async () => {
		const onRequestLocation = vi.fn();
		render(
			<ProfessionalsNearbyControl
				{...base}
				isNearbyMode={false}
				onRequestLocation={onRequestLocation}
			/>,
		);
		await userEvent.click(screen.getByText("Perto de mim"));
		expect(onRequestLocation).toHaveBeenCalledTimes(1);
	});

	it("disables button when locationLoading=true", () => {
		render(
			<ProfessionalsNearbyControl
				{...base}
				isNearbyMode={false}
				locationLoading={true}
			/>,
		);
		expect(screen.getByText("Perto de mim")).toBeDisabled();
	});
});
