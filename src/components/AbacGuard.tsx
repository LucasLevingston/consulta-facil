import { usePermission } from "@/features/auth";
import type { AbacGuardProps } from "./AbacGuard.types";
export function AbacGuard({
	permission,
	attrs,
	fallback = null,
	children,
}: AbacGuardProps) {
	const { can } = usePermission();
	return can(permission, attrs) ? <>{children}</> : <>{fallback}</>;
}
