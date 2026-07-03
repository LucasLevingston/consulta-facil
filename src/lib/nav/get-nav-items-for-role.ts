import type { NavEntry, UserRole } from "./nav-registry.types";
import { registry } from "./nav-registry-store";

export function getNavItemsForRole(role: UserRole): NavEntry[] {
	return registry.filter((e) => e.roles.includes(role));
}
