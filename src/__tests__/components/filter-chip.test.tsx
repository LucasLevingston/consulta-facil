import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FilterChip } from "@/components/clinics/FilterChip";

describe("FilterChip", () => {
	it("renders label text", () => {
		render(<FilterChip label="Cardiologia" onRemove={vi.fn()} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renders icon when provided", () => {
		render(
			<FilterChip
				label="Test"
				icon={<span data-testid="icon" />}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("calls onRemove when X button clicked", async () => {
		const onRemove = vi.fn();
		render(<FilterChip label="Test" onRemove={onRemove} />);
		await userEvent.click(screen.getByRole("button"));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("renders X button", () => {
		render(<FilterChip label="Test" onRemove={vi.fn()} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders label as ReactNode", () => {
		render(<FilterChip label={<strong>Bold</strong>} onRemove={vi.fn()} />);
		expect(screen.getByText("Bold")).toBeInTheDocument();
	});
});
