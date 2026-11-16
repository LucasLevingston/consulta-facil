import { describe, expect, it } from "vitest";
import { makeColumns as fromUtils } from "@/utils/table/columns";
import { makeColumns } from "./columns";

describe("components/table/columns", () => {
	it("re-exports the shared column factory", () => {
		expect(makeColumns).toBe(fromUtils);
	});
});
