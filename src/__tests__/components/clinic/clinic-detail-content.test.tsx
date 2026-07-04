import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseParams = vi.fn();
const mockUseSearchParams = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
	useParams: () => mockUseParams(),
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("@/components/clinic/ClinicDetailBody", () => ({
	ClinicDetailBody: ({
		clinicId,
		activeTab,
	}: {
		clinicId: string;
		activeTab: string;
	}) => (
		<div>
			body:{clinicId}:{activeTab}
		</div>
	),
}));

import { ClinicDetailContent } from "@/components/clinic/ClinicDetailContent";

describe("ClinicDetailContent", () => {
	it("renders ClinicDetailBody com o clinicId da rota", () => {
		mockUseParams.mockReturnValue({ id: "c-1" });
		mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
		render(<ClinicDetailContent />);
		expect(screen.getByText(/body:c-1/)).toBeInTheDocument();
	});

	it("usa 'overview' como aba padrão quando não há query param", () => {
		mockUseParams.mockReturnValue({ id: "c-1" });
		mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
		render(<ClinicDetailContent />);
		expect(screen.getByText(/overview$/)).toBeInTheDocument();
	});

	it("usa a aba da query string quando válida", () => {
		mockUseParams.mockReturnValue({ id: "c-1" });
		mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=members"));
		render(<ClinicDetailContent />);
		expect(screen.getByText(/members$/)).toBeInTheDocument();
	});

	it("usa 'overview' quando a aba da query string é inválida", () => {
		mockUseParams.mockReturnValue({ id: "c-1" });
		mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=invalido"));
		render(<ClinicDetailContent />);
		expect(screen.getByText(/overview$/)).toBeInTheDocument();
	});
});
