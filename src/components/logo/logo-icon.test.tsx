import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
	default: ({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) => (
		// biome-ignore lint/performance/noImgElement: mock
		<img src={src} alt={alt} {...props} />
	),
}));

import { LogoIcon } from "./logo-icon";

describe("LogoIcon", () => {
	it("renders the favicon at 40x40 by default", () => {
		render(<LogoIcon />);

		const img = screen.getByAltText("Consulta Facil Logo");
		expect(img).toHaveAttribute("src", "/favicon.ico");
		expect(img).toHaveAttribute("width", "40");
		expect(img).toHaveAttribute("height", "40");
	});

	it("lets callers override the size", () => {
		render(<LogoIcon width={24} height={24} />);

		expect(screen.getByAltText("Consulta Facil Logo")).toHaveAttribute(
			"width",
			"24",
		);
	});
});
