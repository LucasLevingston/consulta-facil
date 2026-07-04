import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		className,
	}: {
		href: string;
		children: React.ReactNode;
		className?: string;
	}) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	__esModule: true,
	default: ({ name }: { name: string }) => (
		<div data-testid={`field-${name}`}>{name}</div>
	),
	FormFieldType: { INPUT: "input", TEXTAREA: "textarea" },
}));
vi.mock("@/components/ui/carousel", () => ({
	Carousel: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CarouselContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CarouselItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CarouselPrevious: () => <button type="button">anterior</button>,
	CarouselNext: () => <button type="button">próximo</button>,
}));

import { ContactSection } from "@/components/ContactSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
	it("renderiza o texto de direitos reservados", () => {
		render(<Footer />);
		expect(
			screen.getByText(/ConsultaFácil. Todos os direitos reservados/),
		).toBeInTheDocument();
	});

	it("renderiza os links de termos e privacidade", () => {
		render(<Footer />);
		expect(screen.getByText("Termos de Serviço")).toBeInTheDocument();
		expect(screen.getByText("Privacidade")).toBeInTheDocument();
	});
});

describe("ContactSection", () => {
	it("renderiza o título da seção", () => {
		render(<ContactSection />);
		expect(screen.getByText("Entre em Contato")).toBeInTheDocument();
	});

	it("renderiza os campos do formulário e o botão de envio", () => {
		render(<ContactSection />);
		expect(screen.getByTestId("field-name")).toBeInTheDocument();
		expect(screen.getByTestId("field-email")).toBeInTheDocument();
		expect(screen.getByTestId("field-message")).toBeInTheDocument();
		expect(screen.getByText("Enviar Mensagem")).toBeInTheDocument();
	});
});

describe("FeaturesSection", () => {
	it("renderiza o título e a descrição da seção", () => {
		render(<FeaturesSection />);
		expect(screen.getByText("Recursos do ConsultaFácil")).toBeInTheDocument();
		expect(
			screen.getByText(/simplifica o agendamento de consultas/),
		).toBeInTheDocument();
	});

	it("renderiza pelo menos uma área/especialidade do carrossel", () => {
		render(<FeaturesSection />);
		expect(screen.getAllByText("Ver profissionais").length).toBeGreaterThan(0);
	});
});
