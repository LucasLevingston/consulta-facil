import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const refetch = vi.fn();

vi.mock("@/components/procedure-requests/hooks", () => ({
	useGetMyProcedureRequests: vi.fn(),
}));
vi.mock("@/components/professionals/hooks", () => ({
	useApplicationStatus: vi.fn(),
}));
vi.mock("@/components/custom/suspense-boundary/suspense-boundary", () => ({
	SuspenseBoundary: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { useGetMyProcedureRequests } from "@/components/procedure-requests/hooks";
import { useApplicationStatus } from "@/components/professionals/hooks";
import { ProcedureRequestsContent } from "./ProcedureRequestsContent";

describe("ProcedureRequestsContent", () => {
	beforeEach(() => {
		vi.mocked(useGetMyProcedureRequests).mockReturnValue({
			data: [],
		} as never);
		vi.mocked(useApplicationStatus).mockReturnValue({
			isLoading: false,
			error: null,
			data: { id: "prof-1" },
			refetch,
		} as never);
	});

	it("renderiza a view do paciente quando isProfessional=false", () => {
		render(<ProcedureRequestsContent isProfessional={false} />);
		expect(
			screen.getByText("Nenhuma solicitação de procedimento para você."),
		).toBeInTheDocument();
	});

	it("renderiza a view do profissional quando isProfessional=true", () => {
		render(<ProcedureRequestsContent isProfessional={true} />);
		expect(
			screen.getByText("Nenhuma solicitação criada ainda."),
		).toBeInTheDocument();
	});
});
