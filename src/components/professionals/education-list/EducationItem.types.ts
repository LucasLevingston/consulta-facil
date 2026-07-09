import type { ProfessionalResponse } from "@/features/professionals";

export type EducationItem = NonNullable<
	ProfessionalResponse["education"]
>[number];
