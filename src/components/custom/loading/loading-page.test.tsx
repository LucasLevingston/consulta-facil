import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/logo", () => ({
	Logo: () => <span>logo</span>,
}));

import { LoadingPage } from "./loading-page";

describe("LoadingPage", () => {
	it("shows the brand together with a spinner", () => {
		const { container } = render(<LoadingPage />);

		expect(screen.getByText("logo")).toBeInTheDocument();
		expect(container.querySelector(".animate-spin")).toBeInTheDocument();
	});
});
