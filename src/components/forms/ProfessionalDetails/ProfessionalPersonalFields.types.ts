import type { UseFormReturn } from "react-hook-form";

export interface ProfessionalPersonalFieldsProps {
	// biome-ignore lint/suspicious/noExplicitAny: shared with ProfessionalDetailsForm schema
	form: UseFormReturn<any>;
}
