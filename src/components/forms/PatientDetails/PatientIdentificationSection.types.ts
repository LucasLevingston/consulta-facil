import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { PatientFormValidation } from "./FormValidation";

export interface PatientIdentificationSectionProps {
	form: UseFormReturn<z.infer<typeof PatientFormValidation>>;
}
