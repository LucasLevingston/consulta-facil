import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth", () => ({ useUserStore: vi.fn() }));
vi.mock("./use-update-notification-preferences", () => ({
	useUpdateNotificationPreferences: vi.fn(),
}));

import { useUserStore } from "@/features/auth";
import { NotificationPreferencesCard } from "./NotificationPreferencesCard";
import { useUpdateNotificationPreferences } from "./use-update-notification-preferences";

const mutate = vi.fn();

function setup(user: Record<string, unknown> | null, isPending = false) {
	vi.mocked(useUserStore).mockReturnValue({ user } as never);
	vi.mocked(useUpdateNotificationPreferences).mockReturnValue({
		mutate,
		isPending,
	} as never);
	render(<NotificationPreferencesCard />);
	return screen.getByRole("switch", { name: "Mensagens pelo WhatsApp" });
}

describe("NotificationPreferencesCard", () => {
	beforeEach(() => vi.clearAllMocks());

	it("is on for users who never changed the setting", () => {
		const toggle = setup({ id: "u1" });

		expect(toggle).toBeChecked();
		expect(toggle).toBeEnabled();
	});

	it("reflects an opt-out saved on the account", () => {
		expect(
			setup({ id: "u1", whatsappNotificationsEnabled: false }),
		).not.toBeChecked();
	});

	it("saves the new preference when toggled", async () => {
		const toggle = setup({ id: "u1", whatsappNotificationsEnabled: true });

		await userEvent.click(toggle);

		expect(mutate).toHaveBeenCalledWith({
			whatsappNotificationsEnabled: false,
		});
	});

	it("is disabled while saving or before the user is loaded", () => {
		expect(setup({ id: "u1" }, true)).toBeDisabled();
		vi.clearAllMocks();
		document.body.innerHTML = "";
		expect(setup(null)).toBeDisabled();
	});
});
