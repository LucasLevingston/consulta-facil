import { z } from "zod";
import { PROFESSIONAL_TYPE_LABELS } from "@/utils/constants/professional-types";

const professionalTypeValues = Object.keys(PROFESSIONAL_TYPE_LABELS) as [
	string,
	...string[],
];

export const professionalTypeSchema = z.enum(professionalTypeValues, {
	error: "Selecione uma profissão",
});

export type ProfessionalType = z.infer<typeof professionalTypeSchema>;
