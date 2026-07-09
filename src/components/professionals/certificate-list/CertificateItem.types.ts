import type { ProfessionalResponse } from "@/features/professionals";

export type CertificateItem = NonNullable<
	ProfessionalResponse["certificates"]
>[number];
