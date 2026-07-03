import type { NavEntry } from "./nav-registry.types";
import { registry } from "./nav-registry-store";

export function registerNavItem(entry: NavEntry): void {
	registry.push(entry);
}
