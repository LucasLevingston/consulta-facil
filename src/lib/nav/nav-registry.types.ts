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
