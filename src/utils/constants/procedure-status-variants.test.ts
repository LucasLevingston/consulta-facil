import { describe, expect, it } from "vitest";
import { STATUS_VARIANTS } from "./procedure-status-variants";

describe("STATUS_VARIANTS (procedure)", () => {
	it("PENDING is 'default'", () => {
		expect(STATUS_VARIANTS.PENDING).toBe("default");
	});
	it("CANCELED is 'destructive'", () => {
		expect(STATUS_VARIANTS.CANCELED).toBe("destructive");
	});
	it("COMPLETED is 'outline'", () => {
		expect(STATUS_VARIANTS.COMPLETED).toBe("outline");
	});
	it("SCHEDULED is 'secondary'", () => {
		expect(STATUS_VARIANTS.SCHEDULED).toBe("secondary");
	});
});
