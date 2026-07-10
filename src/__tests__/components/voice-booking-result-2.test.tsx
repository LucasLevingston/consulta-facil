import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments", () => ({}));
vi.mock("@/utils/constants/profession-specialties", () => ({
	SPECIALTY_LABELS: { CARDIOLOGY: "Cardiologia" },
}));
vi.mock("@/components/ui/badge", () => ({
	Badge: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
}));
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

import { VoiceBookingResultCard } from "@/components/custom/voice-booking-button";

const baseResult = {
	summary: "Consulta de cardiologia amanhã de manhã",
	specialty: "CARDIOLOGY",
	date: "2026-07-10",
	timePreference: "morning" as const,
};

describe("VoiceBookingResultCard interactions", () => {
	it("renders Noite for timePreference=evening", () => {
		const result = { ...baseResult, timePreference: "evening" as const };
		render(
			<VoiceBookingResultCard
				result={result as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(screen.getByText("Noite")).toBeInTheDocument();
	});

	it("does not render time badge when timePreference=any", () => {
		const result = { ...baseResult, timePreference: "any" as never };
		render(
			<VoiceBookingResultCard
				result={result as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Manhã")).not.toBeInTheDocument();
		expect(screen.queryByText("Tarde")).not.toBeInTheDocument();
	});

	it("calls onReset when X button clicked", async () => {
		const onReset = vi.fn();
		render(
			<VoiceBookingResultCard
				result={baseResult as never}
				onReset={onReset}
				onUse={vi.fn()}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onReset).toHaveBeenCalledTimes(1);
	});

	it("calls onUse when Usar esses dados clicked", async () => {
		const onUse = vi.fn();
		render(
			<VoiceBookingResultCard
				result={baseResult as never}
				onReset={vi.fn()}
				onUse={onUse}
			/>,
		);
		await userEvent.click(screen.getByText("Usar esses dados"));
		expect(onUse).toHaveBeenCalledTimes(1);
	});
});
