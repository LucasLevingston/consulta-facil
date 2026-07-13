import { describe, expect, it } from "vitest";
import { PERMISSIONS } from "./permissions";

describe("PERMISSIONS — ownership-aware rules (allowOwn)", () => {
	const user = "user-1";
	const other = "user-2";

	it("appointment:cancel:own — PATIENT owner allowed", () => {
		expect(
			PERMISSIONS["appointment:cancel:own"]("PATIENT", {
				userId: user,
				ownerId: user,
			}),
		).toBe(true);
	});

	it("appointment:cancel:own — PATIENT non-owner denied", () => {
		expect(
			PERMISSIONS["appointment:cancel:own"]("PATIENT", {
				userId: user,
				ownerId: other,
			}),
		).toBe(false);
	});

	it("appointment:cancel:own — ADMIN bypasses ownership", () => {
		expect(
			PERMISSIONS["appointment:cancel:own"]("ADMIN", {
				userId: user,
				ownerId: other,
			}),
		).toBe(true);
	});

	it("appointment:cancel:own — PROFESSIONAL denied (wrong role)", () => {
		expect(
			PERMISSIONS["appointment:cancel:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: user,
			}),
		).toBe(false);
	});

	it("appointment:view:own — no ownerId set allows by role", () => {
		expect(
			PERMISSIONS["appointment:view:own"]("PATIENT", { userId: user }),
		).toBe(true);
		expect(
			PERMISSIONS["appointment:view:own"]("PROFESSIONAL", { userId: user }),
		).toBe(true);
	});

	it("clinical-note:edit:own — PROFESSIONAL owner allowed", () => {
		expect(
			PERMISSIONS["clinical-note:edit:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: user,
			}),
		).toBe(true);
	});

	it("clinical-note:edit:own — PROFESSIONAL non-owner denied", () => {
		expect(
			PERMISSIONS["clinical-note:edit:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: other,
			}),
		).toBe(false);
	});

	it("clinical-note:edit:own — PATIENT denied (wrong role)", () => {
		expect(
			PERMISSIONS["clinical-note:edit:own"]("PATIENT", {
				userId: user,
				ownerId: user,
			}),
		).toBe(false);
	});
});
