import type { ProfileInfoRowProps } from "./ProfileInfoRow.types";

export function ProfileInfoRow({
	icon: Icon,
	label,
	value,
}: ProfileInfoRowProps) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-3">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
				<Icon className="h-4 w-4 text-muted-foreground" />
			</div>
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-sm font-medium break-words">{value}</p>
			</div>
		</div>
	);
}
