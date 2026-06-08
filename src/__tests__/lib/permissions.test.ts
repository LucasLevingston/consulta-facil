import { describe, expect, it } from "vitest";
import { PERMISSIONS } from "@/lib/permissions";

describe("PERMISSIONS — role-only rules", () => {
	it("appointment:schedule — PATIENT allowed, PROFESSIONAL denied", () => {
		expect(PERMISSIONS["appointment:schedule"]("PATIENT")).toBe(true);
		expect(PERMISSIONS["appointment:schedule"]("PROFESSIONAL")).toBe(false);
		expect(PERMISSIONS["appointment:schedule"]("ADMIN")).toBe(false);
	});

	it("appointment:confirm — PROFESSIONAL and ADMIN allowed, PATIENT denied", () => {
		expect(PERMISSIONS["appointment:confirm"]("PROFESSIONAL")).toBe(true);
		expect(PERMISSIONS["appointment:confirm"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["appointment:confirm"]("PATIENT")).toBe(false);
	});

	it("admin:access — only ADMIN", () => {
		expect(PERMISSIONS["admin:access"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["admin:access"]("PROFESSIONAL")).toBe(false);
		expect(PERMISSIONS["admin:access"]("PATIENT")).toBe(false);
		expect(PERMISSIONS["admin:access"]("RECEPTIONIST")).toBe(false);
	});

	it("clinic:manage — PROFESSIONAL and ADMIN", () => {
		expect(PERMISSIONS["clinic:manage"]("PROFESSIONAL")).toBe(true);
		expect(PERMISSIONS["clinic:manage"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["clinic:manage"]("PATIENT")).toBe(false);
	});
});

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

	it("appointment:reschedule:own — PROFESSIONAL owner allowed", () => {
		expect(
			PERMISSIONS["appointment:reschedule:own"]("PROFESSIONAL", {
				userId: user,
				ownerId: user,
			}),
		).toBe(true);
	});
});
