import type { ReactNode } from "react";

interface Props {
	iconBg: string;
	icon: ReactNode;
	label: string;
	value: string;
	subtitle: string;
}

export function PatientScoreStatItem({
	iconBg,
	icon,
	label,
	value,
	subtitle,
}: Props) {
	return (
		<div className="flex items-center gap-3">
			<div
				className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
			>
				{icon}
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-semibold text-foreground">{value}</p>
				<p className="text-xs text-muted-foreground">{subtitle}</p>
			</div>
		</div>
	);
}
