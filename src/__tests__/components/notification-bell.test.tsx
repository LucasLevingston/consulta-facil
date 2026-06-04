import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/api/notifications/use-notifications", () => ({
	useNotifications: vi.fn(),
}));
vi.mock("@/hooks/api/notifications/use-unread-count", () => ({
	useUnreadCount: vi.fn(),
}));
vi.mock("@/hooks/api/notifications/use-mark-all-as-read", () => ({
	useMarkAllAsRead: vi.fn(),
}));
vi.mock("@/hooks/api/notifications/use-accept-invite", () => ({
	useAcceptInvite: vi.fn(),
}));
vi.mock("@/hooks/api/notifications/use-decline-invite", () => ({
	useDeclineInvite: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import { NotificationBell } from "@/components/custom/notifications/NotificationBell";
import { useAcceptInvite } from "@/hooks/api/notifications/use-accept-invite";
import { useDeclineInvite } from "@/hooks/api/notifications/use-decline-invite";
import { useMarkAllAsRead } from "@/hooks/api/notifications/use-mark-all-as-read";
import { useNotifications } from "@/hooks/api/notifications/use-notifications";
import { useUnreadCount } from "@/hooks/api/notifications/use-unread-count";

const mockUseNotifications = vi.mocked(useNotifications);
const mockUseUnreadCount = vi.mocked(useUnreadCount);
const mockUseMarkAllAsRead = vi.mocked(useMarkAllAsRead);
const mockUseAcceptInvite = vi.mocked(useAcceptInvite);
const mockUseDeclineInvite = vi.mocked(useDeclineInvite);

function setupMocks({ count = 0, notifications = [] } = {}) {
	mockUseUnreadCount.mockReturnValue({ data: count } as never);
	mockUseNotifications.mockReturnValue({ data: notifications } as never);
	mockUseMarkAllAsRead.mockReturnValue({ mutate: vi.fn() } as never);
	mockUseAcceptInvite.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
	mockUseDeclineInvite.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
}

describe("NotificationBell", () => {
	it("renders bell button", () => {
		setupMocks();
		render(<NotificationBell />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("hides badge when unreadCount = 0", () => {
		setupMocks({ count: 0 });
		render(<NotificationBell />);
		expect(screen.queryByText("0")).not.toBeInTheDocument();
	});

	it("shows count badge when unreadCount > 0", async () => {
		setupMocks({ count: 3 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("shows 9+ when unreadCount > 9", async () => {
		setupMocks({ count: 15 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("9+")).toBeInTheDocument();
	});

	it("opens popover on click", async () => {
		setupMocks({ count: 0 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Notificações")).toBeInTheDocument();
	});

	it("shows 'Nenhuma notificação' when empty", async () => {
		setupMocks({ count: 0, notifications: [] });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Nenhuma notificação")).toBeInTheDocument();
	});

	it("shows 'Marcar todas como lidas' when unreadCount > 0", async () => {
		setupMocks({ count: 2 });
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
		setupMocks({ count: 1, notifications });
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
		setupMocks({ count: 1, notifications });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Aceitar")).toBeInTheDocument();
		expect(screen.getByText("Recusar")).toBeInTheDocument();
	});
});
