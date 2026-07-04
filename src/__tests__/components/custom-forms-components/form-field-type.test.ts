import { describe, expect, it } from "vitest";
import { FormFieldType } from "@/components/custom/forms-components/form-field-type";

describe("FormFieldType", () => {
	it("expõe os valores do enum em runtime", () => {
		expect(FormFieldType.INPUT).toBe("input");
		expect(FormFieldType.EMAIL).toBe("email");
		expect(FormFieldType.PASSWORD).toBe("password");
		expect(FormFieldType.TEXTAREA).toBe("textarea");
		expect(FormFieldType.CHECKBOX).toBe("checkbox");
		expect(FormFieldType.SELECT).toBe("select");
		expect(FormFieldType.DATE_PICKER).toBe("date-picker");
	});

	it("contém exatamente 7 variantes conhecidas", () => {
		const values = Object.values(FormFieldType);
		expect(values).toHaveLength(7);
	});
});
