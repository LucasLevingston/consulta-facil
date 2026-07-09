import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	updateBioSchema: {},
	useUpdateBio: vi.fn(),
}));

import { BioForm } from "@/components/professionals/bio-form";
import {
	ProfessionalContactCard,
	ProfessionalDetailCards,
} from "@/components/professionals/professional-detail-cards";
import { ProfessionalHeroCard } from "@/components/professionals/professional-hero-card";
import { RatingDistributionCard } from "@/components/professionals/rating-distribution-card";
import { SocialLinkField } from "@/components/professionals/social-links-form";
import { useUpdateBio } from "@/features/professionals";

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

describe("ProfessionalContactCard", () => {
	it("renderiza e-mail, telefone e registro quando fornecidos", () => {
		render(
			<ProfessionalContactCard
				professional={
					{
						email: "medico@email.com",
						phone: "(11) 99999-0000",
						licenseNumber: "CRM-1234",
						bio: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("medico@email.com")).toBeInTheDocument();
		expect(screen.getByText("(11) 99999-0000")).toBeInTheDocument();
		expect(screen.getByText("CRM-1234")).toBeInTheDocument();
	});

	it("renderiza o card 'Sobre' quando há bio", () => {
		render(
			<ProfessionalContactCard
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: "Atuo há 10 anos.",
					} as never
				}
			/>,
		);
		expect(screen.getByText("Sobre")).toBeInTheDocument();
		expect(screen.getByText("Atuo há 10 anos.")).toBeInTheDocument();
	});

	it("não renderiza o card 'Sobre' quando não há bio", () => {
		render(
			<ProfessionalContactCard
				professional={
					{ email: null, phone: null, licenseNumber: null, bio: null } as never
				}
			/>,
		);
		expect(screen.queryByText("Sobre")).not.toBeInTheDocument();
	});
});

describe("ProfessionalDetailCards", () => {
	it("renderiza a especialidade quando fornecida", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: "Cardiologia",
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renderiza mensagem quando não há especialidade", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(
			screen.getByText("Especialidade não informada."),
		).toBeInTheDocument();
	});

	it("renderiza redes sociais quando há links", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: "https://instagram.com/x",
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("Redes sociais")).toBeInTheDocument();
		expect(screen.getByText("Instagram")).toBeInTheDocument();
	});

	it("não renderiza o card de redes sociais quando não há links", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.queryByText("Redes sociais")).not.toBeInTheDocument();
	});
});

describe("ProfessionalHeroCard", () => {
	const professional = {
		name: "Dra. Ana Silva",
		specialty: "Cardiologia",
		imageUrl: null,
		rating: 4.5,
		consultationCount: 10,
	} as never;

	it("renderiza o nome do profissional", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
	});

	it("renderiza o botão de mensagem quando messaging.available=true", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.getByText("Enviar mensagem")).toBeInTheDocument();
	});

	it("não renderiza o botão de mensagem quando messaging.available=false", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: false, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Enviar mensagem")).not.toBeInTheDocument();
	});

	it("chama onSchedule ao clicar em 'Agendar consulta'", async () => {
		const onSchedule = vi.fn();
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={onSchedule}
			/>,
		);
		await userEvent.click(screen.getByText("Agendar consulta"));
		expect(onSchedule).toHaveBeenCalledTimes(1);
	});

	it("chama onSend ao clicar em 'Enviar mensagem'", async () => {
		const onSend = vi.fn();
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend }}
				onSchedule={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Enviar mensagem"));
		expect(onSend).toHaveBeenCalledTimes(1);
	});
});

describe("RatingDistributionCard", () => {
	it("renderiza mensagem quando não há avaliações", () => {
		render(
			<RatingDistributionCard
				ratings={
					{ averageRating: null, totalRatings: 0, distribution: {} } as never
				}
			/>,
		);
		expect(screen.getByText("Nenhuma avaliacao ainda.")).toBeInTheDocument();
	});

	it("renderiza a média e o total de avaliações", () => {
		render(
			<RatingDistributionCard
				ratings={
					{
						averageRating: 4.2,
						totalRatings: 15,
						distribution: { "5": 8, "4": 5, "3": 2 },
					} as never
				}
			/>,
		);
		expect(screen.getByText("4.2")).toBeInTheDocument();
		expect(screen.getByText(/15 avaliacoes/)).toBeInTheDocument();
	});
});

describe("SocialLinkField", () => {
	type Values = { instagramUrl?: string };

	function Harness({ defaultValues }: { defaultValues?: Values }) {
		const form = useForm<Values>({ defaultValues });
		return (
			<FormProvider {...form}>
				<SocialLinkField
					control={form.control as never}
					name="instagramUrl"
					label="Instagram"
					placeholder="https://instagram.com/..."
					icon={<Mail data-testid="icon" />}
				/>
				<span data-testid="value">{form.watch("instagramUrl")}</span>
			</FormProvider>
		);
	}

	it("renderiza o label e o ícone", () => {
		render(<Harness />);
		expect(screen.getByText("Instagram")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(<Harness defaultValues={{ instagramUrl: "https://insta/x" }} />);
		expect(
			screen.getByPlaceholderText("https://instagram.com/..."),
		).toHaveValue("https://insta/x");
	});

	it("propaga a digitação para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("https://instagram.com/...");
		await userEvent.type(input, "https://insta/novo");
		expect(screen.getByTestId("value")).toHaveTextContent("https://insta/novo");
	});
});
