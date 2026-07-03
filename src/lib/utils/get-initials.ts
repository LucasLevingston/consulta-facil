export function getInitials(name: string | null | undefined): string {
	return (
		name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ?? "?"
	);
}
