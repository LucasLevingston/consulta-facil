import type { LucideIcon } from "lucide-react";

export type { LoginResponse } from "@/lib/schemas/auth/login-response.schema";
export type { UserResponse } from "@/lib/schemas/auth/user-response.schema";

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
