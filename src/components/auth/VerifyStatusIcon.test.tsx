import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VerifyStatusIcon } from "./VerifyStatusIcon";

describe("VerifyStatusIcon", () => {
	it("renders spinning icon when isLoading=true", () => {
		const { container } = render(
			<VerifyStatusIcon isLoading={true} isSuccess={false} />,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("animate-spin");
	});

	it("renders green check when isSuccess=true and not loading", () => {
		const { container } = render(
			<VerifyStatusIcon isLoading={false} isSuccess={true} />,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("text-green-500");
	});

	it("renders error X icon when both false", () => {
		const { container } = render(
			<VerifyStatusIcon isLoading={false} isSuccess={false} />,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("text-destructive");
	});

	it("loading takes priority when isLoading=true regardless of isSuccess", () => {
		const { container } = render(
			<VerifyStatusIcon isLoading={true} isSuccess={true} />,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("animate-spin");
	});
});
