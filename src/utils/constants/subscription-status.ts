export const SUBSCRIPTION_STATUS_COLOR: Record<string, string> = {
	ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
	PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
	CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
	EXPIRED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
};

export const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
	ACTIVE: "Ativo",
	PENDING: "Pendente",
	CANCELLED: "Cancelado",
	EXPIRED: "Expirado",
};
