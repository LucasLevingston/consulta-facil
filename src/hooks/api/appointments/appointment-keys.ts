export const appointmentKeys = {
	all: ["appointments"] as const,
	byPatient: (userId: string) =>
		[...appointmentKeys.all, "patient", userId] as const,
	byProfessional: (professionalId: string) =>
		[...appointmentKeys.all, "professional", professionalId] as const,
	detail: (id: string) => [...appointmentKeys.all, id] as const,
};
