import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/appointments/hooks", () => ({
	useConfirmAppointment: vi.fn(),
	useCompleteAppointment: vi.fn(),
}));
vi.mock("@/components/auth/hooks", () => ({
	usePermission: vi.fn(),
}));
vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));
vi.mock("@/components/table/AppointmentCancelButton", () => ({
	AppointmentCancelButton: () => <div>mock-cancel-button</div>,
}));
vi.mock("@/components/table/AppointmentRateButton", () => ({
	AppointmentRateButton: () => <div>mock-rate-button</div>,
}));

import {
	useCompleteAppointment,
	useConfirmAppointment,
} from "@/components/appointments/hooks";
import { usePermission } from "@/components/auth/hooks";
import { AppointmentActions } from "@/components/table/AppointmentActions";
import { useUserStore } from "@/features/auth";

const mockConfirm = vi.mocked(useConfirmAppointment);
const mockComplete = vi.mocked(useCompleteAppointment);
const mockUsePermission = vi.mocked(usePermission);
const mockUseUserStore = vi.mocked(useUserStore);

function setupPermissions(allowed: Record<string, boolean>) {
	mockUsePermission.mockReturnValue({
		can: vi.fn((permission: string) => allowed[permission] ?? false),
		role: "PATIENT",
	} as never);
	mockUseUserStore.mockReturnValue({ user: { id: "p-1" } } as never);
}

const baseAppointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "prof-1",
	status: "PENDING",
	rating: null,
} as never;

describe("AppointmentActions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockConfirm.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue(undefined),
			isPending: false,
		} as never);
		mockComplete.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue(undefined),
			isPending: false,
		} as never);
	});

	it("não renderiza nada quando nenhuma ação é permitida", () => {
		setupPermissions({});
		const { container } = render(
			<AppointmentActions appointment={baseAppointment} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra o botão Confirmar quando permitido e status é PENDING", () => {
		setupPermissions({ "appointment:confirm": true });
		render(<AppointmentActions appointment={baseAppointment} />);
		expect(screen.getByText("Confirmar")).toBeInTheDocument();
	});

	it("chama confirm.mutateAsync ao clicar em Confirmar", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockConfirm.mockReturnValue({ mutateAsync, isPending: false } as never);
		setupPermissions({ "appointment:confirm": true });
		render(<AppointmentActions appointment={baseAppointment} />);
		await userEvent.click(screen.getByText("Confirmar"));
		expect(mutateAsync).toHaveBeenCalledWith("a-1");
	});

	it("mostra o botão Concluir quando permitido e status é CONFIRMED", () => {
		setupPermissions({ "appointment:complete": true });
		render(
			<AppointmentActions
				appointment={{ ...baseAppointment, status: "CONFIRMED" }}
			/>,
		);
		expect(screen.getByText("Concluir")).toBeInTheDocument();
	});

	it("chama complete.mutateAsync ao clicar em Concluir", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockComplete.mockReturnValue({ mutateAsync, isPending: false } as never);
		setupPermissions({ "appointment:complete": true });
		render(
			<AppointmentActions
				appointment={{ ...baseAppointment, status: "CONFIRMED" }}
			/>,
		);
		await userEvent.click(screen.getByText("Concluir"));
		expect(mutateAsync).toHaveBeenCalledWith("a-1");
	});

	it("renderiza AppointmentRateButton quando avaliação é permitida e consulta concluída sem nota", () => {
		setupPermissions({ "appointment:rate": true });
		render(
			<AppointmentActions
				appointment={{ ...baseAppointment, status: "COMPLETED", rating: null }}
			/>,
		);
		expect(screen.getByText("mock-rate-button")).toBeInTheDocument();
	});

	it("renderiza AppointmentCancelButton quando cancelamento é permitido", () => {
		setupPermissions({ "appointment:cancel:own": true });
		render(<AppointmentActions appointment={baseAppointment} />);
		expect(screen.getByText("mock-cancel-button")).toBeInTheDocument();
	});
});
