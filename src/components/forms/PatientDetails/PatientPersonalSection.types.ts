import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { PatientFormValidation } from "./FormValidation";

export interface PatientPersonalSectionProps {
	form: UseFormReturn<z.infer<typeof PatientFormValidation>>;
}
