import { z } from "zod";
import { paymentMethodSchema } from "./payment-method.schema";
import { paymentTimingSchema } from "./payment-timing.schema";
import { professionalProfileStatusSchema } from "./professional-profile-status.schema";

export const professionalResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	profession: z.string().nullable().optional(),
	specialty: z.string(),
	licenseNumber: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	rating: z.number().nullable().optional(),
	consultationCount: z.number().nullable().optional(),
	status: professionalProfileStatusSchema.nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	clinicId: z.string().nullable().optional(),
	clinicName: z.string().nullable().optional(),
	consultationPrice: z.number().nullable().optional(),
	acceptedPaymentMethods: z.array(paymentMethodSchema).optional().default([]),
	paymentTiming: paymentTimingSchema.nullable().optional(),
	instagramUrl: z.string().nullable().optional(),
	linkedinUrl: z.string().nullable().optional(),
	websiteUrl: z.string().nullable().optional(),
	bio: z.string().nullable().optional(),
});

export type ProfessionalResponse = z.infer<typeof professionalResponseSchema>;

// Backwards-compatible aliases
export const doctorResponseSchema = professionalResponseSchema;
export type DoctorResponse = ProfessionalResponse;
