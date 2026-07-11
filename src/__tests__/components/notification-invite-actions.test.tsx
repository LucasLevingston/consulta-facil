import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/custom/notifications/use-accept-invite", () => ({
	useAcceptInvite: vi.fn(),
}));
vi.mock("@/components/custom/notifications/use-decline-invite", () => ({
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
import { useAcceptInvite } from "@/components/custom/notifications/use-accept-invite";
import { useDeclineInvite } from "@/components/custom/notifications/use-decline-invite";

const mockAccept = vi.mocked(useAcceptInvite);
const mockDecline = vi.mocked(useDeclineInvite);

beforeEach(() => {
	mockAccept.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockDecline.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("NotificationInviteActions render", () => {
	it("renders null when type is not CLINIC_INVITE", () => {
		const { container } = render(
			<NotificationInviteActions
				notificationId="n-1"
				type="GENERAL"
				status="PENDING"
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders accept and decline buttons when CLINIC_INVITE + PENDING", () => {
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

	it("renders Convite aceito when status=ACCEPTED", () => {
		render(
			<NotificationInviteActions
				notificationId="n-1"
				type="CLINIC_INVITE"
				status="ACCEPTED"
			/>,
		);
		expect(screen.getByText("Convite aceito")).toBeInTheDocument();
	});
});
