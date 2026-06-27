import type { ReactNode } from "react";
import type { PermissionKey } from "@/lib/permission-key";

export interface AbacGuardProps {
	permission: PermissionKey;
	attrs?: Record<string, unknown>;
	fallback?: ReactNode;
	children: ReactNode;
}
