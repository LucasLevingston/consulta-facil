import { render, screen } from "@testing-library/react";
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

import { VoiceBookingResultCard } from "@/components/custom/voice-booking-result";

const baseResult = {
	summary: "Consulta de cardiologia amanhã de manhã",
	specialty: "CARDIOLOGY",
	date: "2026-07-10",
	timePreference: "morning" as const,
};

describe("VoiceBookingResultCard", () => {
	it("renders result summary", () => {
		render(
			<VoiceBookingResultCard
				result={baseResult as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(
			screen.getByText("Consulta de cardiologia amanhã de manhã"),
		).toBeInTheDocument();
	});

	it("renders specialty label from SPECIALTY_LABELS", () => {
		render(
			<VoiceBookingResultCard
				result={baseResult as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renders Manhã for timePreference=morning", () => {
		render(
			<VoiceBookingResultCard
				result={baseResult as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(screen.getByText("Manhã")).toBeInTheDocument();
	});

	it("renders Tarde for timePreference=afternoon", () => {
		const result = { ...baseResult, timePreference: "afternoon" as const };
		render(
			<VoiceBookingResultCard
				result={result as never}
				onReset={vi.fn()}
				onUse={vi.fn()}
			/>,
		);
		expect(screen.getByText("Tarde")).toBeInTheDocument();
	});
});
