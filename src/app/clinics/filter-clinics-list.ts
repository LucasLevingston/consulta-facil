import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";

interface ClinicsListFilters {
	search: string;
	filterState: string;
	filterCity: string;
	filterSpecialty: string;
	filterProfession: string;
}

export function filterClinicsList(
	baseList: ClinicResponse[],
	filters: ClinicsListFilters,
): ClinicResponse[] {
	let r = baseList;
	if (filters.search.trim())
		r = r.filter((c) =>
			c.name.toLowerCase().includes(filters.search.toLowerCase()),
		);
	if (filters.filterState) r = r.filter((c) => c.state === filters.filterState);
	if (filters.filterCity)
		r = r.filter((c) =>
			c.city?.toLowerCase().includes(filters.filterCity.toLowerCase()),
		);
	if (filters.filterSpecialty)
		r = r.filter((c) =>
			c.members?.some((m) => m.specialty === filters.filterSpecialty),
		);
	if (filters.filterProfession)
		r = r.filter((c) =>
			c.members?.some((m) => m.role === filters.filterProfession),
		);
	return r;
}
