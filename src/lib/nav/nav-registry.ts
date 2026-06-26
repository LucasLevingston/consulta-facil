import type { LucideIcon } from "lucide-react";

export type UserRole = "PATIENT" | "PROFESSIONAL" | "ADMIN";

export interface NavEntry {
	roles: UserRole[];
	label: string;
	title: string;
	url: string;
	icon: LucideIcon;
	tooltip?: string;
}

const registry: NavEntry[] = [];

export function registerNavItem(entry: NavEntry): void {
	registry.push(entry);
}

export function getNavItemsForRole(role: UserRole): NavEntry[] {
	return registry.filter((e) => e.roles.includes(role));
}

export function getNavItemsByLabel(role: UserRole, label: string): NavEntry[] {
	return getNavItemsForRole(role).filter((e) => e.label === label);
}
