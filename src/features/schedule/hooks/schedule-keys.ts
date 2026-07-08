export const scheduleKeys = {
	all: ["schedule"] as const,
	mySchedule: () => [...scheduleKeys.all, "me"] as const,
	byProfessional: (id: string) => [...scheduleKeys.all, id] as const,
	clinicHours: (clinicId: string) =>
		["clinic-working-hours", clinicId] as const,
};
