import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/clinics", () => ({}));
vi.mock("@/components/clinic/clinic-overview-tab", () => ({
	ClinicOverviewTab: () => <div>overview</div>,
}));
vi.mock("@/components/clinic/clinic-members-tab", () => ({
	ClinicMembersTab: () => <div>members-tab</div>,
}));
vi.mock("@/components/clinic/clinic-appointments-tab", () => ({
	ClinicAppointmentsTab: () => <div>appointments-tab</div>,
}));
vi.mock("@/components/clinic/clinic-financial-tab", () => ({
	ClinicFinancialTab: () => <div>financial-tab</div>,
}));
vi.mock("@/components/ui/tabs", () => ({
	Tabs: ({ children, value }: { children: React.ReactNode; value: string }) => (
		<div data-active={value}>{children}</div>
	),
	TabsList: ({ children }: { children: React.ReactNode }) => (
		<div role="tablist">{children}</div>
	),
	TabsTrigger: ({
		children,
		value,
		onClick,
	}: {
		children: React.ReactNode;
		value: string;
		onClick?: () => void;
	}) => (
		<button type="button" role="tab" data-value={value} onClick={onClick}>
			{children}
		</button>
	),
	TabsContent: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-tabcontent={value}>{children}</div>,
}));

import { ClinicDetailTabs } from "./ClinicDetailTabs";

const clinic = {
	id: "c-1",
	members: [{ id: "m-1" }, { id: "m-2" }],
};

const base = {
	clinic: clinic as never,
	activeTab: "overview",
	onTabChange: vi.fn(),
	isMember: false,
	isManager: false,
	currentUserId: undefined,
	myProfessionalProfileId: undefined,
};

describe("ClinicDetailTabs", () => {
	it("renders Visão Geral tab", () => {
		render(<ClinicDetailTabs {...base} />);
		expect(screen.getByText("Visão Geral")).toBeInTheDocument();
	});

	it("renders Profissionais tab with member count", () => {
		render(<ClinicDetailTabs {...base} />);
		expect(screen.getByText(/Profissionais \(2\)/)).toBeInTheDocument();
	});

	it("renders Consultas tab when isMember=true", () => {
		render(<ClinicDetailTabs {...base} isMember={true} />);
		expect(screen.getByText("Consultas")).toBeInTheDocument();
	});

	it("hides Consultas tab when isMember=false", () => {
		render(<ClinicDetailTabs {...base} isMember={false} />);
		expect(screen.queryByText("Consultas")).not.toBeInTheDocument();
	});

	it("renders Financeiro tab when isManager=true", () => {
		render(<ClinicDetailTabs {...base} isManager={true} />);
		expect(screen.getByText("Financeiro")).toBeInTheDocument();
	});

	it("hides Financeiro tab when isManager=false", () => {
		render(<ClinicDetailTabs {...base} isManager={false} />);
		expect(screen.queryByText("Financeiro")).not.toBeInTheDocument();
	});
});
