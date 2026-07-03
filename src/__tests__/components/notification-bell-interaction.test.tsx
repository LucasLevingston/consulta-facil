import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/notifications", () => ({
	useNotifications: vi.fn(),
	useUnreadCount: vi.fn(),
	useMarkAllAsRead: vi.fn(),
	useAcceptInvite: vi.fn(),
	useDeclineInvite: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import { NotificationBell } from "@/components/custom/notifications/NotificationBell";
import {
	useAcceptInvite,
	useDeclineInvite,
	useMarkAllAsRead,
	useNotifications,
	useUnreadCount,
} from "@/features/notifications";

function setup({ count = 0, notifications = [] } = {}) {
	vi.mocked(useUnreadCount).mockReturnValue({ data: count } as never);
	vi.mocked(useNotifications).mockReturnValue({ data: notifications } as never);
	vi.mocked(useMarkAllAsRead).mockReturnValue({ mutate: vi.fn() } as never);
	vi.mocked(useAcceptInvite).mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
	vi.mocked(useDeclineInvite).mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
}

describe("NotificationBell interaction", () => {
	it("shows 'Nenhuma notificação' when empty", async () => {
		setup({ count: 0, notifications: [] });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Nenhuma notificação")).toBeInTheDocument();
	});

	it("shows 'Marcar todas como lidas' when unreadCount > 0", async () => {
		setup({ count: 2 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Marcar todas como lidas")).toBeInTheDocument();
	});

	it("renders notification items", async () => {
		const notifications = [
			{
				id: "n-1",
				title: "Consulta confirmada",
				message: "Sua consulta foi confirmada.",
				type: "APPOINTMENT_CONFIRMED",
				status: "PENDING",
				createdAt: new Date().toISOString(),
			},
		];
		setup({ count: 1, notifications });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Consulta confirmada")).toBeInTheDocument();
	});

	it("renders clinic invite with accept/decline buttons", async () => {
		const notifications = [
			{
				id: "n-2",
				title: "Convite de clínica",
				message: "Você foi convidado.",
				type: "CLINIC_INVITE",
				status: "PENDING",
				createdAt: new Date().toISOString(),
			},
		];
		setup({ count: 1, notifications });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Aceitar")).toBeInTheDocument();
		expect(screen.getByText("Recusar")).toBeInTheDocument();
	});
});
