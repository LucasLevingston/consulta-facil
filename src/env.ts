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
	})
	.parse({
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_GRAFANA_FARO_URL:
			process.env.NEXT_PUBLIC_GRAFANA_FARO_URL ?? "",
		NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
	});
