import {
	type Faro,
	getWebInstrumentations,
	initializeFaro,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

let faro: Faro | null = null;

export function initFaro(): void {
	if (typeof window === "undefined") return;
	if (faro) return;

	const url = process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;
	if (!url) return;

	faro = initializeFaro({
		url,
		app: {
			name: "consulta-facil-web",
			version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
			environment: process.env.NODE_ENV,
		},
		instrumentations: [
			...getWebInstrumentations({ captureConsole: false }),
			new TracingInstrumentation(),
		],
	});
}

export function getFaro(): Faro | null {
	return faro;
}
