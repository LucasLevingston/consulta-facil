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
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

import { NotificationInviteActions } from "@/components/custom/notifications/NotificationInviteActions";
import { useAcceptInvite, useDeclineInvite } from "@/features/notifications";

const mockAccept = vi.mocked(useAcceptInvite);
const mockDecline = vi.mocked(useDeclineInvite);

beforeEach(() => {
	mockAccept.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockDecline.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("NotificationInviteActions interaction", () => {
	it("renders Convite recusado when status=DECLINED", () => {
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="DECLINED"
			/>,
		);
		expect(screen.getByText("Convite recusado")).toBeInTheDocument();
	});

	it("disables buttons when accept is pending", () => {
		mockAccept.mockReturnValue({ mutate: vi.fn(), isPending: true } as never);
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="PENDING"
			/>,
		);
		expect(screen.getByText("Aceitar").closest("button")).toBeDisabled();
	});

	it("calls accept.mutate when Aceitar clicked", async () => {
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
});
