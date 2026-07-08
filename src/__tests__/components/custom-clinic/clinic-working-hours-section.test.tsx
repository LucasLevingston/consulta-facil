import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/schedule", () => ({
	useClinicWorkingHours: vi.fn(),
}));
vi.mock("@/components/custom/clinic/ClinicHoursEditor", () => ({
	ClinicHoursEditor: ({
		clinicId,
		savedHours,
	}: {
		clinicId: string;
		savedHours: unknown[];
	}) => (
		<div>
			ClinicHoursEditor:{clinicId}:{savedHours.length}
		</div>
	),
}));

import { ClinicWorkingHoursSection } from "@/components/custom/clinic/ClinicWorkingHoursSection";
import { useClinicWorkingHours } from "@/features/schedule";

const mockUseClinicWorkingHours = vi.mocked(useClinicWorkingHours);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("ClinicWorkingHoursSection", () => {
	it("renderiza o título e a descrição da seção", () => {
		mockUseClinicWorkingHours.mockReturnValue({ data: [] } as never);
		render(<ClinicWorkingHoursSection clinicId="c-1" />);
		expect(screen.getByText("Horários de funcionamento")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Configure os dias e horários em que a clínica está aberta.",
			),
		).toBeInTheDocument();
	});

	it("repassa clinicId e savedHours vazios para o editor", () => {
		mockUseClinicWorkingHours.mockReturnValue({ data: [] } as never);
		render(<ClinicWorkingHoursSection clinicId="c-42" />);
		expect(screen.getByText("ClinicHoursEditor:c-42:0")).toBeInTheDocument();
	});

	it("repassa os horários carregados para o editor quando presentes", () => {
		mockUseClinicWorkingHours.mockReturnValue({
			data: [
				{
					dayOfWeek: "MONDAY",
					openTime: "08:00",
					closeTime: "18:00",
					isOpen: true,
				},
			],
		} as never);
		render(<ClinicWorkingHoursSection clinicId="c-42" />);
		expect(screen.getByText("ClinicHoursEditor:c-42:1")).toBeInTheDocument();
	});
});
