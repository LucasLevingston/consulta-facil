import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), defaults: { headers: { common: {} } } },
}));

import { usePermission } from "@/hooks/use-permission";
import { useUserStore } from "@/store/useUserStore";

const makeUser = (role: string) => ({
	id: "u-1",
	name: "Test",
	email: "test@email.com",
	role,
	phone: "11999999999",
	cpf: "00000000000",
});

describe("usePermission", () => {
	afterEach(() => {
		useUserStore.setState({ user: null });
	});

	it("returns false when no user", () => {
		useUserStore.setState({ user: null });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("appointment:schedule")).toBe(false);
	});

	it("PATIENT can schedule appointment", () => {
		useUserStore.setState({ user: makeUser("PATIENT") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("appointment:schedule")).toBe(true);
	});

	it("PROFESSIONAL cannot schedule appointment", () => {
		useUserStore.setState({ user: makeUser("PROFESSIONAL") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("appointment:schedule")).toBe(false);
	});

	it("ADMIN can access admin panel", () => {
		useUserStore.setState({ user: makeUser("ADMIN") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("admin:access")).toBe(true);
	});

	it("PATIENT cannot access admin panel", () => {
		useUserStore.setState({ user: makeUser("PATIENT") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("admin:access")).toBe(false);
	});

	it("returns current role", () => {
		useUserStore.setState({ user: makeUser("PROFESSIONAL") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.role).toBe("PROFESSIONAL");
	});

	it("RECEPTIONIST can access reception", () => {
		useUserStore.setState({ user: makeUser("RECEPTIONIST") as never });
		const { result } = renderHook(() => usePermission());
		expect(result.current.can("reception:access")).toBe(true);
	});
});
