import { getNavItemsForRole } from "./get-nav-items-for-role";
import type { NavGroup, UserRole } from "./nav-registry.types";

export function getNavGroupsForRole(role: UserRole): NavGroup[] {
	const items = getNavItemsForRole(role);
	const groupMap = new Map<string, NavGroup>();

	for (const { roles: _roles, label, ...rest } of items) {
		if (!groupMap.has(label)) groupMap.set(label, { label, items: [] });
		groupMap.get(label)?.items.push(rest);
	}

	return Array.from(groupMap.values());
}
