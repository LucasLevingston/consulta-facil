import { z } from "zod";

const urlOrEmpty = z
	.string()
	.nullable()
	.optional()
	.refine((v) => !v || v.startsWith("http://") || v.startsWith("https://"), {
		message: "Informe uma URL válida (https://...)",
	});

export const updateSocialLinksSchema = z.object({
	instagramUrl: urlOrEmpty,
	linkedinUrl: urlOrEmpty,
	websiteUrl: urlOrEmpty,
});

export type UpdateSocialLinksInput = z.infer<typeof updateSocialLinksSchema>;
