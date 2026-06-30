import type { AppointmentStatus } from "@/features/appointments";
import { cn } from "@/lib/utils/cn";

const statusConfig: Record<
	AppointmentStatus,
	{ label: string; classes: string }
> = {
	CONFIRMED: {
		label: "Confirmada",
		classes: "bg-green-500/15 text-green-400 border-green-500/30",
	},
	CHECKED_IN: {
		label: "Check-in feito",
		classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	},
	IN_PROGRESS: {
		label: "Em atendimento",
		classes:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	},
	PENDING: {
		label: "Pendente",
		classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
	},
	CANCELED: {
		label: "Cancelada",
		classes: "bg-red-500/15 text-red-400 border-red-500/30",
	},
	COMPLETED: {
		label: "Concluída",
		classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
	},
};

export const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
	const config = statusConfig[status] ?? statusConfig.PENDING;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
				config.classes,
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{config.label}
		</span>
	);
};
