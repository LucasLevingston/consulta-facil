import { describe, expect, it } from "vitest";
import { createClinicSchema } from "@/lib/schemas/clinic/create-clinic.schema";
import { createServiceSchema } from "@/lib/schemas/service/create-service.schema";

describe("createClinicSchema", () => {
	it("valid data passes", () => {
		const result = createClinicSchema.safeParse({ name: "Clínica Saúde" });
		expect(result.success).toBe(true);
	});

	it("name too short fails", () => {
		expect(createClinicSchema.safeParse({ name: "X" }).success).toBe(false);
	});

	it("empty name fails", () => {
		expect(createClinicSchema.safeParse({ name: "" }).success).toBe(false);
	});

	it("optional fields pass when missing", () => {
		expect(createClinicSchema.safeParse({ name: "Clínica" }).success).toBe(
			true,
		);
	});
});

describe("createServiceSchema", () => {
	const valid = {
		name: "ECG",
		price: 180,
		durationMinutes: 30,
		requiresConsultation: false,
	};

	it("valid data passes", () => {
		expect(createServiceSchema.safeParse(valid).success).toBe(true);
	});

	it("name too short fails", () => {
		expect(createServiceSchema.safeParse({ ...valid, name: "X" }).success).toBe(
			false,
		);
	});

	it("zero price fails", () => {
		expect(createServiceSchema.safeParse({ ...valid, price: 0 }).success).toBe(
			false,
		);
	});

	it("negative price fails", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, price: -10 }).success,
		).toBe(false);
	});

	it("zero duration fails", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, durationMinutes: 0 }).success,
		).toBe(false);
	});

	it("boolean requiresConsultation required", () => {
		const { requiresConsultation, ...rest } = valid;
		expect(createServiceSchema.safeParse(rest).success).toBe(false);
	});
});
