import { z } from "zod";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

const specialtyValues = Object.keys(SPECIALTY_LABELS) as [string, ...string[]];

export const specialtySchema = z.enum(specialtyValues, {
	error: "Selecione uma especialidade",
});

export type Specialty = z.infer<typeof specialtySchema>;
