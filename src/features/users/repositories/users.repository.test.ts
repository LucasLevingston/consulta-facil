import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/users/users.api", () => ({
	usersApi: { getAll: vi.fn(), updateNotificationPreferences: vi.fn() },
}));

import { usersApi } from "@/lib/api/users/users.api";
import { usersRepository } from "./users.repository";

describe("usersRepository", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getAll forwards paging and role filter", async () => {
		vi.mocked(usersApi.getAll).mockResolvedValueOnce({ content: [] } as never);

		await usersRepository.getAll(2, 10, "ADMIN");

		expect(usersApi.getAll).toHaveBeenCalledWith(2, 10, "ADMIN");
	});

	it("updateNotificationPreferences forwards the preferences", async () => {
		vi.mocked(usersApi.updateNotificationPreferences).mockResolvedValueOnce({
			id: "u1",
		} as never);

		const result = await usersRepository.updateNotificationPreferences({
			whatsappNotificationsEnabled: false,
		});

		expect(usersApi.updateNotificationPreferences).toHaveBeenCalledWith({
			whatsappNotificationsEnabled: false,
		});
		expect(result).toEqual({ id: "u1" });
	});
});
