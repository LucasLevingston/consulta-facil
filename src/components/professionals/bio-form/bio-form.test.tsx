import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	updateBioSchema: {},
}));
vi.mock("./use-update-bio", () => ({
	useUpdateBio: vi.fn(),
}));

import { BioForm } from "./BioForm";
import { useUpdateBio } from "./use-update-bio";

const mockUseUpdateBio = vi.mocked(useUpdateBio);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseUpdateBio.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
});

describe("BioForm", () => {
	const professional = { bio: "Cardiologista experiente." } as never;

	it("renderiza o título 'Sobre mim'", () => {
		render(<BioForm professional={professional} />);
		expect(screen.getByText("Sobre mim")).toBeInTheDocument();
	});

	it("exibe o texto inicial da bio", () => {
		render(<BioForm professional={professional} />);
		expect(
			screen.getByDisplayValue("Cardiologista experiente."),
		).toBeInTheDocument();
	});

	it("exibe o contador de caracteres", () => {
		render(<BioForm professional={professional} />);
		expect(screen.getByText(/\/1000/)).toBeInTheDocument();
	});

	it("chama useUpdateBio.mutate ao submeter o formulário", async () => {
		const mutate = vi.fn();
		mockUseUpdateBio.mockReturnValue({ mutate, isPending: false } as never);
		render(<BioForm professional={professional} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(mutate).toHaveBeenCalledTimes(1);
	});

	it("exibe 'Salvando...' quando isPending é true", () => {
		mockUseUpdateBio.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		render(<BioForm professional={professional} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
	});
});
