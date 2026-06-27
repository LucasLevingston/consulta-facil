import type { z } from "zod";
import type { PatientFormValidation } from "./FormValidation";

type PatientDefaultData = Partial<z.infer<typeof PatientFormValidation>>;

export interface PatientDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: PatientDefaultData;
}
