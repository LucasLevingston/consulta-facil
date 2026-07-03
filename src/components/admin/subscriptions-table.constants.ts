export const STATUS_CONFIG: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	ACTIVE: { label: "Ativa", variant: "default" },
	PENDING: { label: "Pendente", variant: "secondary" },
	CANCELLED: { label: "Cancelada", variant: "destructive" },
	EXPIRED: { label: "Expirada", variant: "outline" },
};

export const OWNER_LABELS: Record<string, string> = {
	PROFESSIONAL: "Médico",
	CLINIC: "Clínica",
	LABORATORY: "Laboratório",
};
