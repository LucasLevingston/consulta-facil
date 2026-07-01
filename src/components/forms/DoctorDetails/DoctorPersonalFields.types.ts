import type { UseFormReturn } from "react-hook-form";

export interface DoctorPersonalFieldsProps {
	// biome-ignore lint/suspicious/noExplicitAny: shared with DoctorDetailsForm schema
	form: UseFormReturn<any>;
}
