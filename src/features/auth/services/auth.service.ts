import { PERMISSIONS } from "@/lib/constants/permissions";
import type { PermissionKey } from "@/lib/permission-key";

export function hasPermission(
	role: Parameters<(typeof PERMISSIONS)[PermissionKey]>[0],
	key: PermissionKey,
	attrs?: Record<string, unknown>,
): boolean {
	return PERMISSIONS[key](role, attrs);
}
