export const clinicKeys = {
	all: ["clinics"] as const,
	list: () => [...clinicKeys.all, "list"] as const,
	my: () => [...clinicKeys.all, "my"] as const,
	detail: (id: string) => [...clinicKeys.all, id] as const,
	nearby: (lat: number, lng: number, radiusKm: number) =>
		[...clinicKeys.all, "nearby", { lat, lng, radiusKm }] as const,
	receptionists: (clinicId: string) =>
		[...clinicKeys.all, clinicId, "receptionists"] as const,
	queue: (clinicId: string) => [...clinicKeys.all, clinicId, "queue"] as const,
};
