import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./use-clinic-working-hours", () => ({
	useClinicWorkingHours: vi.fn(),
}));
const editorProps = vi.hoisted(() => vi.fn());
vi.mock("./ClinicHoursEditor", () => ({
	ClinicHoursEditor: (props: unknown) => {
		editorProps(props);
		return <div>editor de horários</div>;
	},
}));

import { ClinicWorkingHoursContent } from "./ClinicWorkingHoursContent";
import { useClinicWorkingHours } from "./use-clinic-working-hours";

describe("ClinicWorkingHoursContent", () => {
	it("loads the clinic's saved hours and hands them to the editor", () => {
		const savedHours = [
			{ dayOfWeek: "MONDAY", openTime: "08:00", closeTime: "18:00" },
		];
		vi.mocked(useClinicWorkingHours).mockReturnValue({
			data: savedHours,
		} as never);

		render(<ClinicWorkingHoursContent clinicId="clinic-1" />);

		expect(useClinicWorkingHours).toHaveBeenCalledWith("clinic-1");
		expect(screen.getByText("editor de horários")).toBeInTheDocument();
		expect(editorProps).toHaveBeenCalledWith({
			clinicId: "clinic-1",
			savedHours,
		});
	});
});
