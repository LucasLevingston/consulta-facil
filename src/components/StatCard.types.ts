import type { AppointmentStatus } from "@/features/appointments";

export type StatCardProps = {
	type?: AppointmentStatus;
	count: number;
	label: string;
	icon: string;
	onClick?: () => void;
	onActive: boolean;
};
