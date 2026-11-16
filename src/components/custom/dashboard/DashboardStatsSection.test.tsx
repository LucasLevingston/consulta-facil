import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const appointmentsListProps = vi.hoisted(() => vi.fn());
vi.mock("./appointments-list", () => ({
	AppointmentsList: (props: unknown) => {
		appointmentsListProps(props);
		return <div>lista de consultas</div>;
	},
}));

import { DashboardStatsSection } from "./DashboardStatsSection";

describe("DashboardStatsSection", () => {
	const stats = {
		total: 12,
		confirmed: 7,
		pending: 3,
		completed: 1,
		canceled: 2,
	};

	it("shows one card per headline counter", () => {
		render(
			<DashboardStatsSection
				stats={stats}
				upcoming={[]}
				isProfessional={false}
				onConfirm={vi.fn()}
				onComplete={vi.fn()}
			/>,
		);

		for (const [label, count] of [
			["Total", "12"],
			["Confirmadas", "7"],
			["Pendentes", "3"],
			["Canceladas", "2"],
		]) {
			expect(screen.getByText(label)).toBeInTheDocument();
			expect(screen.getByText(count)).toBeInTheDocument();
		}
	});

	it("hands the upcoming appointments and actions to the list", () => {
		const onConfirm = vi.fn();
		const onComplete = vi.fn();
		const upcoming = [{ id: "a1" }] as never;
		render(
			<DashboardStatsSection
				stats={stats}
				upcoming={upcoming}
				isProfessional
				onConfirm={onConfirm}
				onComplete={onComplete}
			/>,
		);

		expect(screen.getByText("lista de consultas")).toBeInTheDocument();
		expect(appointmentsListProps).toHaveBeenLastCalledWith({
			appointments: upcoming,
			isProfessional: true,
			onConfirm,
			onComplete,
		});
	});
});
