import { z } from "zod";

export const env = z
	.object({
		// Required: backend API URL
		NEXT_PUBLIC_API_URL: z
			.string()
			.url("NEXT_PUBLIC_API_URL must be a valid URL"),

		// Optional: Grafana Faro RUM (no-op when blank)
		NEXT_PUBLIC_GRAFANA_FARO_URL: z.string().url().optional().or(z.literal("")),

		// Optional: app version shown in Faro traces
		NEXT_PUBLIC_APP_VERSION: z.string().optional(),

		// Optional: server-side Anthropic AI key (voice booking)
		ANTHROPIC_API_KEY: z.string().optional(),

		// Optional: Google OAuth Client ID (enables "Login com Google" button)
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
	})
	.parse({
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_GRAFANA_FARO_URL:
			process.env.NEXT_PUBLIC_GRAFANA_FARO_URL ?? "",
		NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
		ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
	});
