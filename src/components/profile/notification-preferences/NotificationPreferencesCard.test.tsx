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
}

describe("NotificationPreferencesCard — WhatsApp toggle", () => {
	beforeEach(() => vi.clearAllMocks());

	it("is on for users who never changed the setting", () => {
		setup({ id: "u1" });
		const toggle = screen.getByRole("switch", {
			name: "Mensagens pelo WhatsApp",
		});

		expect(toggle).toBeChecked();
		expect(toggle).toBeEnabled();
	});

	it("reflects an opt-out saved on the account", () => {
		setup({ id: "u1", whatsappNotificationsEnabled: false });
		expect(
			screen.getByRole("switch", { name: "Mensagens pelo WhatsApp" }),
		).not.toBeChecked();
	});

	it("saves the new preference when toggled", async () => {
		setup({ id: "u1", whatsappNotificationsEnabled: true });
		const toggle = screen.getByRole("switch", {
			name: "Mensagens pelo WhatsApp",
		});

		await userEvent.click(toggle);

		expect(mutate).toHaveBeenCalledWith({
			whatsappNotificationsEnabled: false,
		});
	});

	it("is disabled while saving or before the user is loaded", () => {
		setup({ id: "u1" }, true);
		expect(
			screen.getByRole("switch", { name: "Mensagens pelo WhatsApp" }),
		).toBeDisabled();
		vi.clearAllMocks();
		document.body.innerHTML = "";
		setup(null);
		expect(
			screen.getByRole("switch", { name: "Mensagens pelo WhatsApp" }),
		).toBeDisabled();
	});
});

describe("NotificationPreferencesCard — email toggle", () => {
	beforeEach(() => vi.clearAllMocks());

	it("is on for users who never changed the email setting", () => {
		setup({ id: "u1" });
		const toggle = screen.getByRole("switch", { name: "Mensagens por e-mail" });

		expect(toggle).toBeChecked();
		expect(toggle).toBeEnabled();
	});

	it("reflects an opt-out saved on the account", () => {
		setup({ id: "u1", emailNotificationsEnabled: false });
		expect(
			screen.getByRole("switch", { name: "Mensagens por e-mail" }),
		).not.toBeChecked();
	});

	it("saves the new email preference when toggled", async () => {
		setup({ id: "u1", emailNotificationsEnabled: true });
		const toggle = screen.getByRole("switch", { name: "Mensagens por e-mail" });

		await userEvent.click(toggle);

		expect(mutate).toHaveBeenCalledWith({
			emailNotificationsEnabled: false,
		});
	});

	it("is disabled while saving or before the user is loaded", () => {
		setup({ id: "u1" }, true);
		expect(
			screen.getByRole("switch", { name: "Mensagens por e-mail" }),
		).toBeDisabled();
		vi.clearAllMocks();
		document.body.innerHTML = "";
		setup(null);
		expect(
			screen.getByRole("switch", { name: "Mensagens por e-mail" }),
		).toBeDisabled();
	});
});
