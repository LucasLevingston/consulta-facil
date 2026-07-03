import type { Faro } from "@grafana/faro-web-sdk";
import { faroState } from "./faro-instance";

export function getFaro(): Faro | null {
	return faroState.instance;
}
