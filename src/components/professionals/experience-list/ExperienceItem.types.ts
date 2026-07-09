import type { ProfessionalResponse } from "@/features/professionals";

export type ExperienceItem = NonNullable<
	ProfessionalResponse["experience"]
>[number];
