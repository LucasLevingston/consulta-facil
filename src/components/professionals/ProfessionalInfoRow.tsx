export function ProfessionalInfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 text-sm">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="h-4 w-4 text-primary" />
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	);
}
