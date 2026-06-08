import { describe, expect, it } from "vitest";
import type { PermissionKey } from "@/lib/permission-key";
import { PERMISSIONS } from "@/lib/permissions";

type Role = "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";
const ALL_ROLES: Role[] = ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"];

function allowed(permission: PermissionKey, ...roles: Role[]) {
	for (const role of roles) {
		it(`${permission} — ${role} → true`, () => {
			expect(PERMISSIONS[permission](role)).toBe(true);
		});
	}
	const denied = ALL_ROLES.filter((r) => !roles.includes(r));
	for (const role of denied) {
		it(`${permission} — ${role} → false`, () => {
			expect(PERMISSIONS[permission](role)).toBe(false);
		});
	}
}

describe("PERMISSIONS", () => {
	describe("appointments", () => {
		allowed("appointment:schedule", "PATIENT");
		allowed("appointment:view:patient", "PATIENT", "ADMIN");
		allowed("appointment:view:professional", "PROFESSIONAL", "ADMIN");
		allowed("appointment:confirm", "PROFESSIONAL", "ADMIN");
		allowed("appointment:reschedule", "PATIENT", "PROFESSIONAL", "ADMIN");
		allowed("appointment:complete", "PROFESSIONAL", "ADMIN");
		allowed("appointment:rate", "PATIENT");
		allowed("appointment:checkin", "RECEPTIONIST", "PROFESSIONAL", "ADMIN");
		allowed("appointment:delete", "ADMIN");
		allowed("appointment:set_modality", "PROFESSIONAL", "ADMIN");
		allowed("appointment:queue", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
		allowed("appointment:anamnesis:save", "PATIENT", "PROFESSIONAL", "ADMIN");
		allowed("appointment:clinical_note:save", "PROFESSIONAL", "ADMIN");
	});
	describe("clinic", () => {
		allowed("clinic:manage", "PROFESSIONAL", "ADMIN");
	});
	describe("clinic — ownership", () => {
		it("clinic:manage:own — PROFESSIONAL owner → true", () => {
			expect(
				PERMISSIONS["clinic:manage:own"]("PROFESSIONAL", {
					userId: "u1",
					ownerId: "u1",
				}),
			).toBe(true);
		});
		it("clinic:manage:own — PROFESSIONAL non-owner → false", () => {
			expect(
				PERMISSIONS["clinic:manage:own"]("PROFESSIONAL", {
					userId: "u1",
					ownerId: "u2",
				}),
			).toBe(false);
		});
		it("clinic:manage:own — ADMIN bypasses → true", () => {
			expect(
				PERMISSIONS["clinic:manage:own"]("ADMIN", {
					userId: "u1",
					ownerId: "u2",
				}),
			).toBe(true);
		});
	});
	describe("professional", () => {
		allowed("professional:apply", "PATIENT", "ADMIN");
		allowed("professional:manage", "PROFESSIONAL", "ADMIN");
		allowed("professional:approve", "ADMIN");
	});
	describe("patient", () => {
		allowed("patient:profile:view", "PROFESSIONAL", "ADMIN");
		allowed("patient:profile:manage", "PATIENT");
	});
	describe("schedule", () => {
		allowed("schedule:manage", "PROFESSIONAL");
	});
	describe("services", () => {
		allowed("services:manage", "PROFESSIONAL", "ADMIN");
	});
	describe("exam", () => {
		allowed("exam:manage", "PROFESSIONAL", "ADMIN");
		allowed("exam:view", "PATIENT", "PROFESSIONAL", "ADMIN");
		allowed("exam:review:patient", "PATIENT");
		allowed("procedure:manage", "PROFESSIONAL", "ADMIN");
		allowed("procedure:review:patient", "PATIENT");
	});
	describe("billing", () => {
		allowed("billing:view", "PATIENT", "PROFESSIONAL");
		allowed("billing:clinic", "PROFESSIONAL", "ADMIN");
	});
	describe("reception", () => {
		allowed("reception:access", "RECEPTIONIST", "PROFESSIONAL", "ADMIN");
	});
	describe("admin", () => {
		allowed("admin:access", "ADMIN");
	});
});
