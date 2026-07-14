import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureBadge } from "./FeatureBadge";

describe("FeatureBadge", () => {
	it("value='true' → Incluído", () => {
		render(<FeatureBadge value="true" />);
		expect(screen.getByText("Incluído")).toBeInTheDocument();
	});

	it("value='false' → Não incluído", () => {
		render(<FeatureBadge value="false" />);
		expect(screen.getByText("Não incluído")).toBeInTheDocument();
	});

	it("other value → renders value as badge", () => {
		render(<FeatureBadge value="5 consultas" />);
		expect(screen.getByText("5 consultas")).toBeInTheDocument();
	});
});
