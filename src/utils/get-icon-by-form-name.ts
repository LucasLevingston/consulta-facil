import { AtSign, Calendar, FileText, Lock, Phone, User } from "lucide-react";
import type { ElementType } from "react";

const iconMap: Record<string, ElementType> = {
	name: User,
	fullName: User,
	email: AtSign,
	password: Lock,
	confirmPassword: Lock,
	phone: Phone,
	birthDate: Calendar,
	date: Calendar,
	notes: FileText,
	reason: FileText,
	description: FileText,
};

export function getIconByFormName(name: string): ElementType | null {
	return iconMap[name] ?? null;
}
