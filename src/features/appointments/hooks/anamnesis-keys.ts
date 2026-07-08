export const anamnesisKeys = {
	anamnesis: (appointmentId: string) =>
		["appointments", appointmentId, "anamnesis"] as const,
	prontuario: (appointmentId: string) =>
		["appointments", appointmentId, "prontuario"] as const,
};
