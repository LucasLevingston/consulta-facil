import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/professionals/hooks", () => ({
	useMyProfessionalProfile: vi.fn(),
}));

import { ProfessionalHeroSubtitle } from "@/components/custom/dashboard/ProfessionalHeroSubtitle";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";

const mockUseMyProfessionalProfile = vi.mocked(useMyProfessionalProfile);

describe("ProfessionalHeroSubtitle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("não renderiza nada quando o perfil profissional ainda não carregou", () => {
		mockUseMyProfessionalProfile.mockReturnValue({ data: undefined } as never);
		const { container } = render(<ProfessionalHeroSubtitle />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o rótulo da especialidade quando o perfil carrega", () => {
		mockUseMyProfessionalProfile.mockReturnValue({
			data: { specialty: "CARDIOLOGIA", licenseNumber: null },
		} as never);
		render(<ProfessionalHeroSubtitle />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renderiza o número do conselho quando licenseNumber existe", () => {
		mockUseMyProfessionalProfile.mockReturnValue({
			data: { specialty: "PEDIATRIA", licenseNumber: "12345-SP" },
		} as never);
		render(<ProfessionalHeroSubtitle />);
		expect(screen.getByText("Pediatria · CRM 12345-SP")).toBeInTheDocument();
	});

	it("não renderiza o número do conselho quando licenseNumber é ausente", () => {
		mockUseMyProfessionalProfile.mockReturnValue({
			data: { specialty: "PEDIATRIA", licenseNumber: null },
		} as never);
		render(<ProfessionalHeroSubtitle />);
		expect(screen.queryByText(/CRM/)).not.toBeInTheDocument();
	});

	it("usa a especialidade bruta quando não há rótulo mapeado", () => {
		mockUseMyProfessionalProfile.mockReturnValue({
			data: { specialty: "ESPECIALIDADE_DESCONHECIDA", licenseNumber: null },
		} as never);
		render(<ProfessionalHeroSubtitle />);
		expect(screen.getByText("ESPECIALIDADE_DESCONHECIDA")).toBeInTheDocument();
	});
});
