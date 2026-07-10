import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageHeader from "./page-header";

describe("PageHeader", () => {
	it("renders title and description", () => {
		render(
			<PageHeader
				title="Notificações"
				description="Gerencie suas notificações"
			/>,
		);
		expect(screen.getByText("Notificações")).toBeInTheDocument();
		expect(screen.getByText("Gerencie suas notificações")).toBeInTheDocument();
	});

	it("does not render count badge when count undefined", () => {
		render(<PageHeader title="Título" description="Descrição" />);
		expect(screen.queryByText(/canal/i)).not.toBeInTheDocument();
	});

	it("renders count badge when count provided", () => {
		render(<PageHeader title="Título" description="Descrição" count={3} />);
		expect(screen.getByText(/3/)).toBeInTheDocument();
	});

	it("uses countLabel in badge", () => {
		render(
			<PageHeader
				title="Título"
				description="Descrição"
				count={2}
				countLabel="item"
			/>,
		);
		expect(screen.getByText(/item/)).toBeInTheDocument();
	});

	it("appends s suffix when count > 1", () => {
		const { container } = render(
			<PageHeader
				title="Título"
				description="Descrição"
				count={5}
				countLabel="canal"
			/>,
		);
		expect(container.textContent).toContain("s");
	});

	it("does not append s suffix when count = 1", () => {
		const { container } = render(
			<PageHeader
				title="Título"
				description="Descrição"
				count={1}
				countLabel="canal"
			/>,
		);
		const badge = container.querySelector("[class*='primary']");
		expect(badge?.textContent).not.toMatch(/canal s/);
	});

	it("renders custom icon when provided", () => {
		const Icon = () => <svg data-testid="custom-icon" />;
		render(
			<PageHeader title="Título" description="Descrição" icon={<Icon />} />,
		);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("renders default icon when no icon provided", () => {
		const { container } = render(
			<PageHeader title="Título" description="Descrição" />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});
