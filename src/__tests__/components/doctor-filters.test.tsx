import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
}));

import DoctorFilters from "@/components/custom/doctor/DoctorFilters";

describe("DoctorFilters", () => {
	it("renders name search input", () => {
		render(<DoctorFilters />);
		expect(
			screen.getByPlaceholderText("Buscar por nome..."),
		).toBeInTheDocument();
	});

	it("renders Mais filtros toggle button", () => {
		render(<DoctorFilters />);
		expect(screen.getByText("Mais filtros")).toBeInTheDocument();
	});

	it("shows advanced panel when toggle clicked", async () => {
		const user = userEvent.setup();
		render(<DoctorFilters />);
		await user.click(screen.getByText("Mais filtros"));
		expect(screen.getByPlaceholderText(/Botox/i)).toBeInTheDocument();
	});

	it("hides advanced panel on second toggle click", async () => {
		const user = userEvent.setup();
		render(<DoctorFilters />);
		await user.click(screen.getByText("Mais filtros"));
		await user.click(screen.getByText("Mais filtros"));
		expect(screen.queryByPlaceholderText(/Botox/i)).not.toBeInTheDocument();
	});
});
