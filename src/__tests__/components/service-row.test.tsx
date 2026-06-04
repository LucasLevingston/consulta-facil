import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/api/services/use-deactivate-service", () => ({
	useDeactivateService: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { ServiceRow } from "@/components/services/ServiceRow";
import { useDeactivateService } from "@/hooks/api/services/use-deactivate-service";

const mockUseDeactivateService = vi.mocked(useDeactivateService);

const service = {
	id: "svc-1",
	name: "Consulta Cardiológica",
	description: "Avaliação completa.",
	price: 250.0,
	durationMinutes: 60,
	requiresConsultation: false,
	active: true,
};

describe("ServiceRow", () => {
	beforeEach(() => {
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue(undefined),
			isPending: false,
		} as never);
	});

	it("renders service name", () => {
		render(<ServiceRow service={service as never} onEdit={vi.fn()} />);
		expect(screen.getByText("Consulta Cardiológica")).toBeInTheDocument();
	});

	it("renders service price", () => {
		render(<ServiceRow service={service as never} onEdit={vi.fn()} />);
		expect(screen.getByText("R$ 250.00")).toBeInTheDocument();
	});

	it("renders duration", () => {
		render(<ServiceRow service={service as never} onEdit={vi.fn()} />);
		expect(screen.getByText("60 min")).toBeInTheDocument();
	});

	it("renders description when provided", () => {
		render(<ServiceRow service={service as never} onEdit={vi.fn()} />);
		expect(screen.getByText("Avaliação completa.")).toBeInTheDocument();
	});

	it("does not render description when absent", () => {
		const svc = { ...service, description: null };
		render(<ServiceRow service={svc as never} onEdit={vi.fn()} />);
		expect(screen.queryByText("Avaliação completa.")).not.toBeInTheDocument();
	});

	it("shows 'Requer consulta' badge when requiresConsultation=true", () => {
		const svc = { ...service, requiresConsultation: true };
		render(<ServiceRow service={svc as never} onEdit={vi.fn()} />);
		expect(screen.getByText("Requer consulta")).toBeInTheDocument();
	});

	it("calls onEdit when edit button clicked", async () => {
		const onEdit = vi.fn();
		render(<ServiceRow service={service as never} onEdit={onEdit} />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onEdit).toHaveBeenCalledTimes(1);
	});

	it("deactivate button is disabled when isPending=true", () => {
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		render(<ServiceRow service={service as never} onEdit={vi.fn()} />);
		const buttons = screen.getAllByRole("button");
		expect(buttons[1]).toBeDisabled();
	});
});
