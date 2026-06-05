import type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";

export const STATUS_CLASS: Record<AppointmentStatus, string> = {
	PENDING:
		"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400",
	CONFIRMED:
		"bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400",
	CHECKED_IN:
		"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
	IN_PROGRESS:
		"bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
	CANCELED:
		"bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400",
	COMPLETED:
		"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400",
};
