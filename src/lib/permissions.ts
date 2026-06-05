type Role = "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";

type Attrs = Record<string, unknown>;
type Rule = (role: Role, attrs?: Attrs) => boolean;

const allow =
	(...roles: Role[]): Rule =>
	(role) =>
		(roles as string[]).includes(role);

/**
 * All named permissions.
 * Usage: PERMISSIONS["appointment:schedule"](user.role)
 *
 * For ownership checks pass attrs:
 *   PERMISSIONS["appointment:view"](user.role, { ownerId: appointment.patientId, userId: user.id })
 */
export const PERMISSIONS = {
	// ── Appointments ────────────────────────────────────────────────────
	"appointment:schedule": allow("PATIENT"),
	"appointment:view:patient": allow("PATIENT", "ADMIN"),
	"appointment:view:professional": allow("PROFESSIONAL", "ADMIN"),
	"appointment:confirm": allow("PROFESSIONAL", "ADMIN"),
	"appointment:reschedule": allow("PATIENT", "PROFESSIONAL", "ADMIN"),
	"appointment:complete": allow("PROFESSIONAL", "ADMIN"),
	"appointment:rate": allow("PATIENT"),
	"appointment:checkin": allow("RECEPTIONIST", "PROFESSIONAL", "ADMIN"),
	"appointment:delete": allow("ADMIN"),
	"appointment:set_modality": allow("PROFESSIONAL", "ADMIN"),
	"appointment:queue": allow("PROFESSIONAL", "ADMIN", "RECEPTIONIST"),
	"appointment:anamnesis:save": allow("PATIENT", "PROFESSIONAL", "ADMIN"),
	"appointment:clinical_note:save": allow("PROFESSIONAL", "ADMIN"),

	// ── Clinic ───────────────────────────────────────────────────────────
	"clinic:manage": allow("PROFESSIONAL", "ADMIN"),

	// ── Professional ────────────────────────────────────────────────────
	"professional:apply": allow("PATIENT", "ADMIN"),
	"professional:manage": allow("PROFESSIONAL", "ADMIN"),
	"professional:approve": allow("ADMIN"),

	// ── Patient ──────────────────────────────────────────────────────────
	"patient:profile:view": allow("PROFESSIONAL", "ADMIN"),
	"patient:profile:manage": allow("PATIENT"),

	// ── Schedule ─────────────────────────────────────────────────────────
	"schedule:manage": allow("PROFESSIONAL"),

	// ── Services ─────────────────────────────────────────────────────────
	"services:manage": allow("PROFESSIONAL", "ADMIN"),

	// ── Exam & Procedure Requests ────────────────────────────────────────
	"exam:manage": allow("PROFESSIONAL", "ADMIN"),
	"exam:view": allow("PATIENT", "PROFESSIONAL", "ADMIN"),
	"exam:review:patient": allow("PATIENT"),
	"procedure:manage": allow("PROFESSIONAL", "ADMIN"),
	"procedure:review:patient": allow("PATIENT"),

	// ── Billing ──────────────────────────────────────────────────────────
	"billing:view": allow("PATIENT", "PROFESSIONAL"),
	"billing:clinic": allow("PROFESSIONAL", "ADMIN"),

	// ── Receptionist panel ───────────────────────────────────────────────
	"reception:access": allow("RECEPTIONIST", "PROFESSIONAL", "ADMIN"),

	// ── Admin ────────────────────────────────────────────────────────────
	"admin:access": allow("ADMIN"),
} as const satisfies Record<string, Rule>;
