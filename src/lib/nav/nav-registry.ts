import type { NavEntry, NavGroup, UserRole } from "./nav-registry.types";

export type { NavEntry, NavGroup, UserRole } from "./nav-registry.types";

const registry: NavEntry[] = [];

export function registerNavItem(entry: NavEntry): void {
	registry.push(entry);
}

export function getNavItemsForRole(role: UserRole): NavEntry[] {
	return registry.filter((e) => e.roles.includes(role));
}

export function getNavGroupsForRole(role: UserRole): NavGroup[] {
	const items = getNavItemsForRole(role);
	const groupMap = new Map<string, NavGroup>();

	for (const { roles: _roles, label, ...rest } of items) {
		if (!groupMap.has(label)) {
			groupMap.set(label, { label, items: [] });
		}
		groupMap.get(label)?.items.push(rest);
	}

	return Array.from(groupMap.values());
}
