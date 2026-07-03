export const professionalKeys = {
	all: ["professionals"] as const,
	list: (
		page?: number,
		size?: number,
		profession?: string,
		specialty?: string,
		name?: string,
		serviceTitle?: string,
	) =>
		[
			...professionalKeys.all,
			"list",
			{ page, size, profession, specialty, name, serviceTitle },
		] as const,
	search: (specialty: string) => [...professionalKeys.all, "search", specialty] as const,
	detail: (id: string) => [...professionalKeys.all, id] as const,
	ratings: (id: string) => [...professionalKeys.all, id, "ratings"] as const,
	nearby: (lat: number, lng: number, radiusKm: number, specialty?: string, profession?: string) =>
		[...professionalKeys.all, "nearby", { lat, lng, radiusKm, specialty, profession }] as const,
};
