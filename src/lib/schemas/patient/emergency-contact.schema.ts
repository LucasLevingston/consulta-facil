import { z } from "zod";

export { RELATIONSHIP_LABELS } from "./constants";

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
