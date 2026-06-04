import type { LucideIcon } from "lucide-react";

export type { LoginResponse, UserResponse } from "@/lib/schemas/auth.schema";

export interface Area {
	name: string;
	icon: LucideIcon;
	image: string;
}

export interface NavItem {
	title: string;
	url: string;
	icon?: string;
	isActive?: boolean;
	items?: { title: string; url: string; icon?: string }[];
}
