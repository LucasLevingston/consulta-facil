import type { Control } from "react-hook-form";
import type { UpdateMedicalRecordInput } from "@/features/patients";

export interface MedicalVitalsSectionProps {
	control: Control<UpdateMedicalRecordInput>;
	bmi: number | null;
}
