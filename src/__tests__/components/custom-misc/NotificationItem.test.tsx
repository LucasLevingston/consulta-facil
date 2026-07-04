import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/notifications", () => ({
	useAcceptInvite: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	useDeclineInvite: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import { NotificationItem } from "@/components/custom/notifications/NotificationItem";

function makeNotification(overrides: Record<string, unknown> = {}) {
	return {
		id: "n-1",
		type: "GENERAL",
		status: "PENDING",
		title: "Título da notificação",
		message: "Mensagem da notificação",
		createdAt: new Date().toISOString(),
		...overrides,
	} as never;
}

describe("NotificationItem", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza título e mensagem da notificação", () => {
		render(<NotificationItem notification={makeNotification()} />);
		expect(screen.getByText("Título da notificação")).toBeInTheDocument();
		expect(screen.getByText("Mensagem da notificação")).toBeInTheDocument();
	});

	it("exibe o indicador de não lida quando o status é PENDING", () => {
		const { container } = render(
			<NotificationItem
				notification={makeNotification({ status: "PENDING" })}
			/>,
		);
		expect(container.querySelector(".bg-primary")).toBeInTheDocument();
	});

	it("não exibe o indicador de não lida quando o status não é PENDING", () => {
		render(
			<NotificationItem
				notification={makeNotification({ status: "ACCEPTED" })}
			/>,
		);
		expect(screen.queryByText("Convite aceito")).not.toBeInTheDocument();
	});

	it("exibe 'agora' para notificações criadas há poucos segundos", () => {
		render(
			<NotificationItem
				notification={makeNotification({ createdAt: new Date().toISOString() })}
			/>,
		);
		expect(screen.getByText("agora")).toBeInTheDocument();
	});

	it("exibe o tempo em horas para notificações antigas", () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
		render(
			<NotificationItem
				notification={makeNotification({ createdAt: twoHoursAgo })}
			/>,
		);
		expect(screen.getByText("2h atrás")).toBeInTheDocument();
	});

	it("renderiza as ações de convite quando o tipo é CLINIC_INVITE", () => {
		render(
			<NotificationItem
				notification={makeNotification({
					type: "CLINIC_INVITE",
					status: "PENDING",
				})}
			/>,
		);
		expect(screen.getByText("Aceitar")).toBeInTheDocument();
		expect(screen.getByText("Recusar")).toBeInTheDocument();
	});
});
