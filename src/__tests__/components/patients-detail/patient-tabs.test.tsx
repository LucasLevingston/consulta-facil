import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@/components/patients/detail/PatientInfoCard", () => ({
	PatientInfoCard: () => <div>info-card</div>,
}));
vi.mock("@/components/patients/detail/PatientMedicalRecord", () => ({
	PatientMedicalRecord: () => <div>medical-record-card</div>,
}));
vi.mock("@/components/patients/detail/PatientAppointmentHistory", () => ({
	PatientAppointmentHistory: () => <div>appointment-history-card</div>,
}));

import { PatientDetailTabs } from "@/components/patients/detail/PatientDetailTabs";
import type { PatientProfile } from "@/features/patients";

const patient: PatientProfile = { id: "p-1", name: "Maria Silva" };

describe("PatientDetailTabs", () => {
	it("renderiza os três gatilhos de aba", () => {
		render(
			<PatientDetailTabs
				patient={patient}
				appointments={[]}
				medicalRecord={undefined}
				activeTab="info"
				onTabChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Informações")).toBeInTheDocument();
		expect(screen.getByText("Prontuário")).toBeInTheDocument();
		expect(screen.getByText("Consultas")).toBeInTheDocument();
	});

	it("renderiza o card de informações do paciente", () => {
		render(
			<PatientDetailTabs
				patient={patient}
				appointments={[]}
				medicalRecord={undefined}
				activeTab="info"
				onTabChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("info-card")).toBeInTheDocument();
	});

	it("mostra mensagem de prontuário vazio quando medicalRecord é undefined", () => {
		render(
			<PatientDetailTabs
				patient={patient}
				appointments={[]}
				medicalRecord={undefined}
				activeTab="prontuario"
				onTabChange={vi.fn()}
			/>,
		);
		expect(
			screen.getByText("Nenhum prontuário registrado."),
		).toBeInTheDocument();
		expect(screen.queryByText("medical-record-card")).not.toBeInTheDocument();
	});

	it("renderiza o prontuário quando medicalRecord está presente", () => {
		render(
			<PatientDetailTabs
				patient={patient}
				appointments={[]}
				medicalRecord={{ allergies: "Nenhuma" }}
				activeTab="prontuario"
				onTabChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("medical-record-card")).toBeInTheDocument();
		expect(
			screen.queryByText("Nenhum prontuário registrado."),
		).not.toBeInTheDocument();
	});

	it("renderiza o histórico de consultas", () => {
		render(
			<PatientDetailTabs
				patient={patient}
				appointments={[]}
				medicalRecord={undefined}
				activeTab="consultas"
				onTabChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("appointment-history-card")).toBeInTheDocument();
	});
});
