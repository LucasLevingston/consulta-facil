import { describe, expect, it } from "vitest";
import { ALL } from "./filter-sentinels";

describe("filter-sentinels", () => {
	it("ALL sentinel is '__all__'", () => {
		expect(ALL).toBe("__all__");
	});
});
