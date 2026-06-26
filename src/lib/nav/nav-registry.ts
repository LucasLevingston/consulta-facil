import type { LucideIcon } from "lucide-react";

export type UserRole = "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";

export interface NavEntry {
	roles: UserRole[];
	label: string;
	title: string;
	url: string;
	icon: LucideIcon;
	tooltip?: string;
}

export interface NavGroup {
	label: string;
	items: Omit<NavEntry, "roles" | "label">[];
}

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
