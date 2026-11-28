import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadUser = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock("@/features/auth", () => ({ useUserStore: () => ({ loadUser }) }));
vi.mock("@/features/users", () => ({
	usersRepository: { updateNotificationPreferences: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { toast } from "sonner";
import { usersRepository } from "@/features/users";
import { useUpdateNotificationPreferences } from "./use-update-notification-preferences";

const mockUpdate = vi.mocked(usersRepository.updateNotificationPreferences);

function wrapper({ children }: { children: React.ReactNode }) {
	const client = new QueryClient({
		defaultOptions: { mutations: { retry: false } },
	});
	return createElement(QueryClientProvider, { client }, children);
}

describe("useUpdateNotificationPreferences", () => {
	beforeEach(() => vi.clearAllMocks());

	it("saves the preference, reloads the user and confirms the opt-out", async () => {
		mockUpdate.mockResolvedValueOnce({ id: "u1" } as never);
		const { result } = renderHook(() => useUpdateNotificationPreferences(), {
			wrapper,
		});

		await act(async () => {
			result.current.mutate({ whatsappNotificationsEnabled: false });
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith({
			whatsappNotificationsEnabled: false,
		});
		expect(loadUser).toHaveBeenCalledTimes(1);
		expect(toast.success).toHaveBeenCalledWith(
			"Avisos pelo WhatsApp desativados.",
		);
	});

	it("confirms when WhatsApp messages are turned back on", async () => {
		mockUpdate.mockResolvedValueOnce({ id: "u1" } as never);
		const { result } = renderHook(() => useUpdateNotificationPreferences(), {
			wrapper,
		});

		await act(async () => {
			result.current.mutate({ whatsappNotificationsEnabled: true });
		});

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				"Avisos pelo WhatsApp ativados.",
			),
		);
	});

	it("confirms when email notifications are turned off", async () => {
		mockUpdate.mockResolvedValueOnce({ id: "u1" } as never);
		const { result } = renderHook(() => useUpdateNotificationPreferences(), {
			wrapper,
		});

		await act(async () => {
			result.current.mutate({ emailNotificationsEnabled: false });
		});

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				"Avisos por e-mail desativados.",
			),
		);
	});

	it("confirms when email notifications are turned on", async () => {
		mockUpdate.mockResolvedValueOnce({ id: "u1" } as never);
		const { result } = renderHook(() => useUpdateNotificationPreferences(), {
			wrapper,
		});

		await act(async () => {
			result.current.mutate({ emailNotificationsEnabled: true });
		});

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith("Avisos por e-mail ativados."),
		);
	});

	it("reports failures without reloading the user", async () => {
		mockUpdate.mockRejectedValueOnce(new Error("500"));
		const { result } = renderHook(() => useUpdateNotificationPreferences(), {
			wrapper,
		});

		await act(async () => {
			result.current.mutate({ whatsappNotificationsEnabled: false });
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(loadUser).not.toHaveBeenCalled();
	});
});
