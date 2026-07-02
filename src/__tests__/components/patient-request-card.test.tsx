import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/procedure-requests", () => ({
	useCancelProcedureRequest: vi.fn(() => ({
		mutateAsync: vi.fn(),
		isPending: false,
	})),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/procedure-requests/PatientRequestActions", () => ({
	PatientRequestActions: () => null,
}));
vi.mock("@/components/procedure-requests/StatusBadge", () => ({
	StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));
vi.mock("@/components/ui/card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardDescription: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { PatientRequestCard } from "@/components/procedure-requests/PatientRequestCard";

const request = {
	id: "req-1",
	serviceName: "Ultrassom",
	professionalName: "Dr. Silva",
	professionalId: "prof-1",
	status: "PENDING",
	servicePrice: 150,
	serviceDurationMinutes: 30,
	notes: null,
};

describe("PatientRequestCard", () => {
	it("renders service name", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
	});

	it("renders professional name", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.getByText(/Dr. Silva/)).toBeInTheDocument();
	});

	it("renders formatted price", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.getByText(/150\.00/)).toBeInTheDocument();
	});

	it("renders duration in minutes", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.getByText(/30 min/)).toBeInTheDocument();
	});

	it("renders notes when provided", () => {
		const req = { ...request, notes: "Trazer exames anteriores" };
		render(<PatientRequestCard request={req as never} />);
		expect(screen.getByText("Trazer exames anteriores")).toBeInTheDocument();
	});

	it("does not render notes when null", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.queryByText(/Trazer/)).not.toBeInTheDocument();
	});

	it("renders status badge", () => {
		render(<PatientRequestCard request={request as never} />);
		expect(screen.getByText("PENDING")).toBeInTheDocument();
	});
});
