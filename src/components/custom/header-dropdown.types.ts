export interface HeaderDropdownProps {
	user: {
		id: string;
		email: string;
		role: "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";
		imageUrl?: string | null;
	};
}
