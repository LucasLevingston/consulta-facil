import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLayout } from "./page-layout";

describe("PageLayout", () => {
	it("renders its children with the default vertical spacing", () => {
		render(
			<PageLayout>
				<p>conteúdo</p>
			</PageLayout>,
		);

		const content = screen.getByText("conteúdo");
		expect(content.parentElement).toHaveClass("space-y-4");
	});

	it("accepts extra classes", () => {
		render(
			<PageLayout className="p-6">
				<p>conteúdo</p>
			</PageLayout>,
		);

		expect(screen.getByText("conteúdo").parentElement).toHaveClass(
			"space-y-4",
			"p-6",
		);
	});
});
