import type { PatientDetailInfoRowProps } from "./PatientDetailInfoRow.types";

export function PatientDetailInfoRow({
	icon: Icon,
	label,
	value,
}: PatientDetailInfoRowProps) {
	if (!value) return null;
	return (
		<div className="flex items-center gap-3 text-sm">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="h-4 w-4 text-primary" />
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-medium text-foreground">{value}</p>
			</div>
		</div>
	);
}
