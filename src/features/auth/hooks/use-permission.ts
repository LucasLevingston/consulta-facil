import { PERMISSIONS } from "@/lib/constants/permissions";
import type { PermissionKey } from "@/lib/permission-key";
import { useUserStore } from "@/store/useUserStore";

type Attrs = Record<string, unknown>;

/**
 * ABAC permission hook.
 *
 * @example
 * const { can, role } = usePermission();
 *
 * // Simple role check
 * if (can("appointment:schedule")) { ... }
 *
 * // With attribute context
 * if (can("appointment:view:patient", { userId: user.id, ownerId: apt.patientId })) { ... }
 */
export function usePermission() {
	const { user } = useUserStore();
	const role = (user?.role ?? "PATIENT") as Parameters<
		(typeof PERMISSIONS)[PermissionKey]
	>[0];

	const can = (permission: PermissionKey, attrs?: Attrs): boolean => {
		if (!user) return false;
		return PERMISSIONS[permission](role, attrs);
	};

	return { can, role };
}
