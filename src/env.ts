import { z } from "zod";

export const env = z
	.object({
		NEXT_PUBLIC_API_URL: z.string().url(),
		ANTHROPIC_API_KEY: z.string().optional(),
	})
	.parse({
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
	});
