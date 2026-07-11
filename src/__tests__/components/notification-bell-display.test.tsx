import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/custom/notifications/use-notifications", () => ({
	useNotifications: vi.fn(),
}));
vi.mock("@/components/custom/notifications/use-unread-count", () => ({
	useUnreadCount: vi.fn(),
}));
vi.mock("@/components/custom/notifications/use-mark-all-as-read", () => ({
	useMarkAllAsRead: vi.fn(),
}));
vi.mock("@/components/custom/notifications/use-accept-invite", () => ({
	useAcceptInvite: vi.fn(),
}));
vi.mock("@/components/custom/notifications/use-decline-invite", () => ({
	useDeclineInvite: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import { NotificationBell } from "@/components/custom/notifications/NotificationBell";
import { useAcceptInvite } from "@/components/custom/notifications/use-accept-invite";
import { useDeclineInvite } from "@/components/custom/notifications/use-decline-invite";
import { useMarkAllAsRead } from "@/components/custom/notifications/use-mark-all-as-read";
import { useNotifications } from "@/components/custom/notifications/use-notifications";
import { useUnreadCount } from "@/components/custom/notifications/use-unread-count";

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

describe("NotificationBell display", () => {
	it("renders bell button", () => {
		setup();
		render(<NotificationBell />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("hides badge when unreadCount = 0", () => {
		setup({ count: 0 });
		render(<NotificationBell />);
		expect(screen.queryByText("0")).not.toBeInTheDocument();
	});

	it("shows count badge when unreadCount > 0", async () => {
		setup({ count: 3 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("shows 9+ when unreadCount > 9", async () => {
		setup({ count: 15 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("9+")).toBeInTheDocument();
	});

	it("opens popover on click", async () => {
		setup({ count: 0 });
		render(<NotificationBell />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("Notificações")).toBeInTheDocument();
	});
});
