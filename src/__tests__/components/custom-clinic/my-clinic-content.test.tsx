import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/clinics", () => ({
	useMyClinic: vi.fn(),
}));
vi.mock("@/components/forms/ClinicForm", () => ({
	ClinicForm: ({ clinic }: { clinic?: { id: string } }) => (
		<div>ClinicForm:{clinic?.id ?? "novo"}</div>
	),
}));
vi.mock("@/components/custom/clinic/ClinicWorkingHoursSection", () => ({
	ClinicWorkingHoursSection: ({ clinicId }: { clinicId: string }) => (
		<div>ClinicWorkingHoursSection:{clinicId}</div>
	),
}));
vi.mock("@/components/custom/clinic/ReceptionistsSection", () => ({
	ReceptionistsSection: ({ clinicId }: { clinicId: string }) => (
		<div>ReceptionistsSection:{clinicId}</div>
	),
}));

import { MyClinicContent } from "@/components/custom/clinic/MyClinicContent";
import { useMyClinic } from "@/features/clinics";

const mockUseMyClinic = vi.mocked(useMyClinic);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("MyClinicContent", () => {
	it("renderiza apenas o ClinicForm quando o usuário ainda não tem clínica", () => {
		mockUseMyClinic.mockReturnValue({
			data: [],
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByText("ClinicForm:novo")).toBeInTheDocument();
		expect(
			screen.queryByText(/ClinicWorkingHoursSection:/),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/ReceptionistsSection:/)).not.toBeInTheDocument();
	});

	it("renderiza o form e as seções de horários e recepcionistas quando já existe clínica", () => {
		mockUseMyClinic.mockReturnValue({
			data: [{ id: "c-1" }],
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByText("ClinicForm:c-1")).toBeInTheDocument();
		expect(
			screen.getByText("ClinicWorkingHoursSection:c-1"),
		).toBeInTheDocument();
		expect(screen.getByText("ReceptionistsSection:c-1")).toBeInTheDocument();
	});
});
