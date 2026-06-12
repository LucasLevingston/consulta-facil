import { z } from "zod";

import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";

const examTypeValues = Object.keys(EXAM_TYPE_LABELS) as [string, ...string[]];

export const createExamRequestSchema = z.object({
	examName: z.enum(examTypeValues, {
		error: "Selecione um exame",
	}),
	instructions: z.string().max(1000).optional(),
});

export type CreateExamRequestInput = z.infer<typeof createExamRequestSchema>;
