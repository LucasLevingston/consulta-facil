import type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";

export type StatCardProps = {
	type?: AppointmentStatus;
	count: number;
	label: string;
	icon: string;
	onClick?: () => void;
	onActive: boolean;
};
