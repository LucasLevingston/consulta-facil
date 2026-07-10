export const applicationKeys = {
	all: ["professional-applications"] as const,
	status: () => [...applicationKeys.all, "status"] as const,
};
