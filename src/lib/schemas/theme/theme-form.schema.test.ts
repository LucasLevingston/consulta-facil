import { describe, expect, it } from "vitest";
import { themeFormSchema } from "./theme-form.schema";

describe("themeFormSchema", () => {
	it("accepts valid theme string", () => {
		expect(themeFormSchema.safeParse({ theme: "dark" }).success).toBe(true);
	});
	it("accepts light theme", () => {
		expect(themeFormSchema.safeParse({ theme: "light" }).success).toBe(true);
	});
	it("rejects missing theme", () => {
		expect(themeFormSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for theme", () => {
		expect(themeFormSchema.safeParse({ theme: 123 }).success).toBe(false);
	});
});
