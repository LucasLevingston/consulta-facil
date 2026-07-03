import { z } from "zod";

export const councilTypeOptions = [
	{ value: "CRM", label: "CRM" },
	{ value: "CRO", label: "CRO" },
	{ value: "CRP", label: "CRP" },
	{ value: "CREFITO", label: "CREFITO" },
	{ value: "CFO", label: "CFO" },
	{ value: "COREN", label: "COREN" },
	{ value: "CFF", label: "CFF" },
	{ value: "CFN", label: "CFN" },
	{ value: "CFT", label: "CFT" },
	{ value: "CFFA", label: "CFFA" },
	{ value: "OTHER", label: "Outro" },
] as const;

export const updateCouncilSchema = z.object({
	councilType: z.string().nullable().optional(),
	councilState: z.string().max(2).nullable().optional(),
});

export type UpdateCouncilInput = z.infer<typeof updateCouncilSchema>;
