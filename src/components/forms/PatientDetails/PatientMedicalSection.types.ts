import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { PatientFormValidation } from "./FormValidation";

export interface PatientMedicalSectionProps {
	form: UseFormReturn<z.infer<typeof PatientFormValidation>>;
}
