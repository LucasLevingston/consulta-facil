import { z } from "zod";

export const emergencyContactRelationshipSchema = z.enum([
	"MOTHER",
	"FATHER",
	"SPOUSE",
	"SIBLING",
	"CHILD",
	"FRIEND",
	"OTHER",
]);

export const emergencyContactSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(2),
	phone: z.string().min(10),
	email: z.string().email().optional().or(z.literal("")),
	relationship: emergencyContactRelationshipSchema.optional(),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;

export const RELATIONSHIP_LABELS: Record<string, string> = {
	MOTHER: "Mãe",
	FATHER: "Pai",
	SPOUSE: "Cônjuge",
	SIBLING: "Irmão(ã)",
	CHILD: "Filho(a)",
	FRIEND: "Amigo(a)",
	OTHER: "Outro",
};
