export const dependentKeys = {
	all: ["dependents"] as const,
	my: () => [...dependentKeys.all, "my"] as const,
};
