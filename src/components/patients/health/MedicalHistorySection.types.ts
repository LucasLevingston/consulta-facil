import type { Control } from "react-hook-form";
import type { UpdateMedicalRecordInput } from "@/features/patients";

export interface MedicalHistorySectionProps {
	control: Control<UpdateMedicalRecordInput>;
	isPending: boolean;
}
