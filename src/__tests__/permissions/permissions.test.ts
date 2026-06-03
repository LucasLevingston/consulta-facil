import { describe, expect, it } from "vitest";

import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";

type Role = "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";
const ALL_ROLES: Role[] = ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"];

function allowed(permission: PermissionKey, ...roles: Role[]) {
	for (const role of roles) {
		it(`${permission} — ${role} → true`, () => {
			expect(PERMISSIONS[permission](role)).toBe(true);
		});
	}
}

function denied(permission: PermissionKey, ...roles: Role[]) {
	for (const role of roles) {
		it(`${permission} — ${role} → false`, () => {
			expect(PERMISSIONS[permission](role)).toBe(false);
		});
	}
}

// ── Appointments ──────────────────────────────────────────────────────────────

describe("PERMISSIONS — appointment:schedule", () => {
	allowed("appointment:schedule", "PATIENT");
	denied("appointment:schedule", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:view:patient", () => {
	allowed("appointment:view:patient", "PATIENT", "ADMIN");
	denied("appointment:view:patient", "PROFESSIONAL", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:view:professional", () => {
	allowed("appointment:view:professional", "PROFESSIONAL", "ADMIN");
	denied("appointment:view:professional", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:confirm", () => {
	allowed("appointment:confirm", "PROFESSIONAL", "ADMIN");
	denied("appointment:confirm", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:reschedule", () => {
	allowed("appointment:reschedule", "PATIENT", "PROFESSIONAL", "ADMIN");
	denied("appointment:reschedule", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:complete", () => {
	allowed("appointment:complete", "PROFESSIONAL", "ADMIN");
	denied("appointment:complete", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:rate", () => {
	allowed("appointment:rate", "PATIENT");
	denied("appointment:rate", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:checkin", () => {
	allowed("appointment:checkin", "RECEPTIONIST", "PROFESSIONAL", "ADMIN");
	denied("appointment:checkin", "PATIENT");
});

describe("PERMISSIONS — appointment:delete", () => {
	allowed("appointment:delete", "ADMIN");
	denied("appointment:delete", "PATIENT", "PROFESSIONAL", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:set_modality", () => {
	allowed("appointment:set_modality", "PROFESSIONAL", "ADMIN");
	denied("appointment:set_modality", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:queue", () => {
	allowed("appointment:queue", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
	denied("appointment:queue", "PATIENT");
});

describe("PERMISSIONS — appointment:anamnesis:save", () => {
	allowed("appointment:anamnesis:save", "PATIENT", "PROFESSIONAL", "ADMIN");
	denied("appointment:anamnesis:save", "RECEPTIONIST");
});

describe("PERMISSIONS — appointment:clinical_note:save", () => {
	allowed("appointment:clinical_note:save", "PROFESSIONAL", "ADMIN");
	denied("appointment:clinical_note:save", "PATIENT", "RECEPTIONIST");
});

// ── Clinic ────────────────────────────────────────────────────────────────────

describe("PERMISSIONS — clinic:manage", () => {
	allowed("clinic:manage", "PROFESSIONAL", "ADMIN");
	denied("clinic:manage", "PATIENT", "RECEPTIONIST");
});

// ── Professional ──────────────────────────────────────────────────────────────

describe("PERMISSIONS — professional:apply", () => {
	allowed("professional:apply", "PATIENT", "ADMIN");
	denied("professional:apply", "PROFESSIONAL", "RECEPTIONIST");
});

describe("PERMISSIONS — professional:manage", () => {
	allowed("professional:manage", "PROFESSIONAL", "ADMIN");
	denied("professional:manage", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — professional:approve", () => {
	allowed("professional:approve", "ADMIN");
	denied("professional:approve", "PATIENT", "PROFESSIONAL", "RECEPTIONIST");
});

// ── Patient ───────────────────────────────────────────────────────────────────

describe("PERMISSIONS — patient:profile:view", () => {
	allowed("patient:profile:view", "PROFESSIONAL", "ADMIN");
	denied("patient:profile:view", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — patient:profile:manage", () => {
	allowed("patient:profile:manage", "PATIENT");
	denied("patient:profile:manage", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
});

// ── Schedule ──────────────────────────────────────────────────────────────────

describe("PERMISSIONS — schedule:manage", () => {
	allowed("schedule:manage", "PROFESSIONAL");
	denied("schedule:manage", "PATIENT", "ADMIN", "RECEPTIONIST");
});

// ── Services ──────────────────────────────────────────────────────────────────

describe("PERMISSIONS — services:manage", () => {
	allowed("services:manage", "PROFESSIONAL", "ADMIN");
	denied("services:manage", "PATIENT", "RECEPTIONIST");
});

// ── Exam & Procedure ─────────────────────────────────────────────────────────

describe("PERMISSIONS — exam:manage", () => {
	allowed("exam:manage", "PROFESSIONAL", "ADMIN");
	denied("exam:manage", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — exam:view", () => {
	allowed("exam:view", "PATIENT", "PROFESSIONAL", "ADMIN");
	denied("exam:view", "RECEPTIONIST");
});

describe("PERMISSIONS — exam:review:patient", () => {
	allowed("exam:review:patient", "PATIENT");
	denied("exam:review:patient", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
});

describe("PERMISSIONS — procedure:manage", () => {
	allowed("procedure:manage", "PROFESSIONAL", "ADMIN");
	denied("procedure:manage", "PATIENT", "RECEPTIONIST");
});

describe("PERMISSIONS — procedure:review:patient", () => {
	allowed("procedure:review:patient", "PATIENT");
	denied("procedure:review:patient", "PROFESSIONAL", "ADMIN", "RECEPTIONIST");
});

// ── Billing ───────────────────────────────────────────────────────────────────

describe("PERMISSIONS — billing:view", () => {
	allowed("billing:view", "PATIENT", "PROFESSIONAL");
	denied("billing:view", "ADMIN", "RECEPTIONIST");
});

describe("PERMISSIONS — billing:clinic", () => {
	allowed("billing:clinic", "PROFESSIONAL", "ADMIN");
	denied("billing:clinic", "PATIENT", "RECEPTIONIST");
});

// ── Receptionist ──────────────────────────────────────────────────────────────

describe("PERMISSIONS — reception:access", () => {
	allowed("reception:access", "RECEPTIONIST", "PROFESSIONAL", "ADMIN");
	denied("reception:access", "PATIENT");
});

// ── Admin ─────────────────────────────────────────────────────────────────────

describe("PERMISSIONS — admin:access", () => {
	allowed("admin:access", "ADMIN");
	denied("admin:access", "PATIENT", "PROFESSIONAL", "RECEPTIONIST");
});

// ── Sanidade — todas as permissões cobrem todas as roles ─────────────────────

describe("PERMISSIONS — cobertura total (todas as permissões × todas as roles)", () => {
	const keys = Object.keys(PERMISSIONS) as PermissionKey[];

	it("todas as 30 permissões estão definidas", () => {
		expect(keys).toHaveLength(30);
	});

	it("cada permissão retorna boolean para qualquer role", () => {
		for (const key of keys) {
			for (const role of ALL_ROLES) {
				const result = PERMISSIONS[key](role);
				expect(typeof result).toBe("boolean");
			}
		}
	});

	it("nenhuma permissão retorna true para todas as roles (nenhuma é pública)", () => {
		for (const key of keys) {
			const allTrue = ALL_ROLES.every((role) => PERMISSIONS[key](role));
			expect(allTrue).toBe(false);
		}
	});
});
