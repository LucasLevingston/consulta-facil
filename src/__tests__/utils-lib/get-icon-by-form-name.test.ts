import { AtSign, Calendar, FileText, Lock, Phone, User } from "lucide-react";
import { describe, expect, it } from "vitest";
import { getIconByFormName } from "@/utils/get-icon-by-form-name";

describe("getIconByFormName", () => {
	it("name → User", () => expect(getIconByFormName("name")).toBe(User));
	it("fullName → User", () => expect(getIconByFormName("fullName")).toBe(User));
	it("email → AtSign", () => expect(getIconByFormName("email")).toBe(AtSign));
	it("password → Lock", () => expect(getIconByFormName("password")).toBe(Lock));
	it("phone → Phone", () => expect(getIconByFormName("phone")).toBe(Phone));
	it("birthDate → Calendar", () =>
		expect(getIconByFormName("birthDate")).toBe(Calendar));
	it("date → Calendar", () => expect(getIconByFormName("date")).toBe(Calendar));
	it("notes → FileText", () =>
		expect(getIconByFormName("notes")).toBe(FileText));
	it("reason → FileText", () =>
		expect(getIconByFormName("reason")).toBe(FileText));
	it("description → FileText", () =>
		expect(getIconByFormName("description")).toBe(FileText));
	it("unknown field → null", () =>
		expect(getIconByFormName("unknown")).toBeNull());
	it("empty string → null", () => expect(getIconByFormName("")).toBeNull());
});
