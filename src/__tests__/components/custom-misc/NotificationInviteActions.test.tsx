import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/notifications", () => ({
	useAcceptInvite: vi.fn(),
	useDeclineInvite: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import { NotificationInviteActions } from "@/components/custom/notifications/NotificationInviteActions";
import { useAcceptInvite, useDeclineInvite } from "@/features/notifications";

const mockAccept = vi.mocked(useAcceptInvite);
const mockDecline = vi.mocked(useDeclineInvite);

describe("NotificationInviteActions", () => {
	beforeEach(() => {
		mockAccept.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
		mockDecline.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	});

	it("não renderiza nada quando o tipo não é CLINIC_INVITE", () => {
		const { container } = render(
			<NotificationInviteActions
				notificationId="n-1"
				type="GENERAL"
				status="PENDING"
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza os botões Aceitar e Recusar quando pendente", () => {
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="PENDING"
			/>,
		);
		expect(screen.getByText("Aceitar")).toBeInTheDocument();
		expect(screen.getByText("Recusar")).toBeInTheDocument();
	});

	it("chama accept.mutate com o id da notificação ao clicar em Aceitar", async () => {
		const mutate = vi.fn();
		mockAccept.mockReturnValue({ mutate, isPending: false } as never);
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="PENDING"
			/>,
		);
		await userEvent.click(screen.getByText("Aceitar"));
		expect(mutate).toHaveBeenCalledWith("n-1", expect.any(Object));
	});

	it("chama decline.mutate com o id da notificação ao clicar em Recusar", async () => {
		const mutate = vi.fn();
		mockDecline.mockReturnValue({ mutate, isPending: false } as never);
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="PENDING"
			/>,
		);
		await userEvent.click(screen.getByText("Recusar"));
		expect(mutate).toHaveBeenCalledWith("n-1", expect.any(Object));
	});

	it("desabilita os botões enquanto accept ou decline estão pendentes", () => {
		mockAccept.mockReturnValue({ mutate: vi.fn(), isPending: true } as never);
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="PENDING"
			/>,
		);
		expect(screen.getByText("Aceitar").closest("button")).toBeDisabled();
		expect(screen.getByText("Recusar").closest("button")).toBeDisabled();
	});

	it("exibe 'Convite aceito' quando o status é ACCEPTED", () => {
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="ACCEPTED"
			/>,
		);
		expect(screen.getByText("Convite aceito")).toBeInTheDocument();
	});

	it("exibe 'Convite recusado' quando o status é DECLINED", () => {
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="DECLINED"
			/>,
		);
		expect(screen.getByText("Convite recusado")).toBeInTheDocument();
	});
});
