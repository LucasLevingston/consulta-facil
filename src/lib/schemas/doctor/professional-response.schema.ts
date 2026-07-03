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
	facebookUrl: z.string().nullable().optional(),
	bio: z.string().nullable().optional(),
	councilType: z.string().nullable().optional(),
	councilState: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	neighborhood: z.string().nullable().optional(),
	streetNumber: z.string().nullable().optional(),
	complement: z.string().nullable().optional(),
	education: z
		.array(
			z.object({
				id: z.string().optional(),
				degree: z.string(),
				institution: z.string(),
				fieldOfStudy: z.string().nullable().optional(),
				graduationYear: z.number().nullable().optional(),
			}),
		)
		.optional()
		.default([]),
	experience: z
		.array(
			z.object({
				id: z.string().optional(),
				position: z.string(),
				institution: z.string(),
				startYear: z.number(),
				endYear: z.number().nullable().optional(),
				description: z.string().nullable().optional(),
			}),
		)
		.optional()
		.default([]),
	certificates: z
		.array(
			z.object({
				id: z.string().optional(),
				title: z.string(),
				issuingOrganization: z.string().nullable().optional(),
				issueYear: z.number().nullable().optional(),
				certificateUrl: z.string().nullable().optional(),
			}),
		)
		.optional()
		.default([]),
});

export type ProfessionalResponse = z.infer<typeof professionalResponseSchema>;
