import { describe, expect, it } from "vitest";
import { PERMISSIONS } from "./permissions";

describe("PERMISSIONS — ownership-aware rules (allowOwn)", () => {
	const user = "user-1";
	const other = "user-2";

	it("appointment:reschedule:own — PROFESSIONAL owner allowed", () => {
		expect(
			PERMISSIONS["appointment:reschedule:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: user,
			}),
		).toBe(true);
	});

	it("clinic:manage:own — PROFESSIONAL owner allowed", () => {
		expect(
			PERMISSIONS["clinic:manage:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: user,
			}),
		).toBe(true);
	});

	it("clinic:manage:own — PROFESSIONAL non-owner denied", () => {
		expect(
			PERMISSIONS["clinic:manage:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: other,
			}),
		).toBe(false);
	});

	it("clinic:manage:own — ADMIN bypasses ownership", () => {
		expect(
			PERMISSIONS["clinic:manage:own"]("ADMIN", {
				userId: user,
				ownerId: other,
			}),
		).toBe(true);
	});

	it("clinic:manage:own — PATIENT denied", () => {
		expect(
			PERMISSIONS["clinic:manage:own"]("PATIENT", {
				userId: user,
				ownerId: user,
			}),
		).toBe(false);
	});
});
