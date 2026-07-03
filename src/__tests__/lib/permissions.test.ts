import { describe, expect, it } from "vitest";
import { PERMISSIONS } from "@/lib/constants/permissions";

describe("PERMISSIONS — role-only rules", () => {
	it("appointment:schedule — PATIENT allowed, PROFESSIONAL denied", () => {
		expect(PERMISSIONS["appointment:schedule"]("PATIENT")).toBe(true);
		expect(PERMISSIONS["appointment:schedule"]("PROFESSIONAL")).toBe(false);
		expect(PERMISSIONS["appointment:schedule"]("ADMIN")).toBe(false);
	});

	it("appointment:confirm — PROFESSIONAL and ADMIN allowed, PATIENT denied", () => {
		expect(PERMISSIONS["appointment:confirm"]("PROFESSIONAL")).toBe(true);
		expect(PERMISSIONS["appointment:confirm"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["appointment:confirm"]("PATIENT")).toBe(false);
	});

	it("admin:access — only ADMIN", () => {
		expect(PERMISSIONS["admin:access"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["admin:access"]("PROFESSIONAL")).toBe(false);
		expect(PERMISSIONS["admin:access"]("PATIENT")).toBe(false);
		expect(PERMISSIONS["admin:access"]("RECEPTIONIST")).toBe(false);
	});

	it("clinic:manage — PROFESSIONAL and ADMIN", () => {
		expect(PERMISSIONS["clinic:manage"]("PROFESSIONAL")).toBe(true);
		expect(PERMISSIONS["clinic:manage"]("ADMIN")).toBe(true);
		expect(PERMISSIONS["clinic:manage"]("PATIENT")).toBe(false);
	});
});
