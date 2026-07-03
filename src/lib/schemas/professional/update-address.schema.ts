import { z } from "zod";

export const updateAddressSchema = z.object({
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	neighborhood: z.string().nullable().optional(),
	streetNumber: z.string().nullable().optional(),
	complement: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
});

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
