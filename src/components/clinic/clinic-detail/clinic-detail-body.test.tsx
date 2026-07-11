import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./ClinicDetailHeader", () => ({
	ClinicDetailHeader: ({
		clinic,
		isOwner,
		isAdmin,
		hasMembership,
	}: {
		clinic: { name: string };
		isOwner: boolean;
		isAdmin: boolean;
		hasMembership: boolean;
	}) => (
		<div>
			header:{clinic.name}:{String(isOwner)}:{String(isAdmin)}:
			{String(hasMembership)}
		</div>
	),
}));
vi.mock("./ClinicDetailTabs", () => ({
	ClinicDetailTabs: ({
		activeTab,
		isMember,
		isManager,
		myProfessionalProfileId,
	}: {
		activeTab: string;
		isMember: boolean;
		isManager: boolean;
		myProfessionalProfileId?: string;
	}) => (
		<div>
			tabs:{activeTab}:{String(isMember)}:{String(isManager)}:
			{myProfessionalProfileId ?? "none"}
		</div>
	),
}));

const mockUseUserStore = vi.fn();
const mockUsePermission = vi.fn();
vi.mock("@/features/auth", () => ({
	useUserStore: (selector: (s: unknown) => unknown) =>
		selector(mockUseUserStore()),
}));
vi.mock("@/components/auth/hooks", () => ({
	usePermission: () => mockUsePermission(),
}));

const mockUseClinicById = vi.fn();
vi.mock("@/components/clinic/hooks", () => ({
	useClinicById: (id: string) => mockUseClinicById(id),
}));

const mockUseApplicationStatus = vi.fn();
vi.mock("@/components/professionals/hooks", () => ({
	useApplicationStatus: () => mockUseApplicationStatus(),
}));

import { ClinicDetailBody } from "./ClinicDetailBody";

const clinic = {
	id: "c-1",
	name: "Clínica Saúde",
	ownerId: "owner-1",
	members: [{ professionalProfileId: "prof-1", role: "OWNER" }],
};

describe("ClinicDetailBody", () => {
	it("renders header e tabs com dados da clínica", () => {
		mockUseUserStore.mockReturnValue({ user: { id: "u-1", role: "PATIENT" } });
		mockUseClinicById.mockReturnValue({ data: clinic });
		mockUseApplicationStatus.mockReturnValue({ data: undefined });
		mockUsePermission.mockReturnValue({ can: () => false });

		render(
			<ClinicDetailBody clinicId="c-1" activeTab="overview" setTab={vi.fn()} />,
		);
		expect(screen.getByText(/header:Clínica Saúde/)).toBeInTheDocument();
		expect(screen.getByText(/tabs:overview/)).toBeInTheDocument();
	});

	it("marca isOwner=true quando o usuário é o dono da clínica", () => {
		mockUseUserStore.mockReturnValue({
			user: { id: "owner-1", role: "PATIENT" },
		});
		mockUseClinicById.mockReturnValue({ data: clinic });
		mockUseApplicationStatus.mockReturnValue({ data: undefined });
		mockUsePermission.mockReturnValue({ can: () => false });

		render(
			<ClinicDetailBody clinicId="c-1" activeTab="overview" setTab={vi.fn()} />,
		);
		expect(screen.getByText(/header:Clínica Saúde:true/)).toBeInTheDocument();
	});

	it("marca isMember=true quando o usuário é membro da clínica", () => {
		mockUseUserStore.mockReturnValue({
			user: { id: "u-2", role: "PROFESSIONAL" },
		});
		mockUseClinicById.mockReturnValue({ data: clinic });
		mockUseApplicationStatus.mockReturnValue({ data: { id: "prof-1" } });
		mockUsePermission.mockReturnValue({ can: () => false });

		render(
			<ClinicDetailBody
				clinicId="c-1"
				activeTab="appointments"
				setTab={vi.fn()}
			/>,
		);
		expect(screen.getByText(/tabs:appointments:true/)).toBeInTheDocument();
	});

	it("marca isManager=true quando usePermission autoriza clinic:manage:own", () => {
		mockUseUserStore.mockReturnValue({
			user: { id: "u-3", role: "PROFESSIONAL" },
		});
		mockUseClinicById.mockReturnValue({ data: clinic });
		mockUseApplicationStatus.mockReturnValue({ data: undefined });
		mockUsePermission.mockReturnValue({ can: () => true });

		render(
			<ClinicDetailBody
				clinicId="c-1"
				activeTab="financial"
				setTab={vi.fn()}
			/>,
		);
		expect(screen.getByText(/tabs:financial:true:true/)).toBeInTheDocument();
	});
});
