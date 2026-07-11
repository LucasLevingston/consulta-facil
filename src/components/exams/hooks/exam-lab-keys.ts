export const examLabKeys = {
	all: ["examLabs"] as const,
	list: () => [...examLabKeys.all, "list"] as const,
	detail: (id: string) => [...examLabKeys.all, id] as const,
	nearby: (lat: number, lng: number, radiusKm: number) =>
		[...examLabKeys.all, "nearby", { lat, lng, radiusKm }] as const,
	slots: (examLabId: string, date: string) =>
		[...examLabKeys.all, examLabId, "slots", date] as const,
};
