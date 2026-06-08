import type { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import type { PermissionKey } from "@/lib/permission-key";

interface AbacGuardProps {
	permission: PermissionKey;
	attrs?: Record<string, unknown>;
	fallback?: ReactNode;
	children: ReactNode;
}

/**
 * Renders children only when the current user has the given permission.
 *
 * @example
 * // Role-only guard
 * <AbacGuard permission="appointment:clinical_note:save">
 *   <ClinicalNoteForm />
 * </AbacGuard>
 *
 * @example
 * // Ownership-aware guard
 * <AbacGuard
 *   permission="appointment:cancel:own"
 *   attrs={{ userId: user.id, ownerId: appointment.patientId }}
 * >
 *   <CancelButton />
 * </AbacGuard>
 */
export function AbacGuard({
	permission,
	attrs,
	fallback = null,
	children,
}: AbacGuardProps) {
	const { can } = usePermission();
	return can(permission, attrs) ? <>{children}</> : <>{fallback}</>;
}
