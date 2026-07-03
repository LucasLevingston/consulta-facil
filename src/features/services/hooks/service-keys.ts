export const serviceKeys = {
	all: ["professional-services"] as const,
	byProfessional: (professionalId: string) =>
		[...serviceKeys.all, professionalId] as const,
};
