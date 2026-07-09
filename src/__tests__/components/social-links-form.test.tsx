import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({
	useUpdateSocialLinks: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	updateSocialLinksSchema: {},
}));
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
vi.mock("@/components/ui/card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardDescription: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	CardContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/professionals/social-links-form/SocialLinkField", () => ({
	SocialLinkField: ({ label }: { label: string }) => <div>{label}</div>,
}));
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		disabled,
	}: {
		children: React.ReactNode;
		disabled?: boolean;
	}) => (
		<button type="button" disabled={disabled}>
			{children}
		</button>
	),
}));

import { SocialLinksForm } from "@/components/professionals/social-links-form";

const professional = {
	instagramUrl: null,
	linkedinUrl: null,
	websiteUrl: null,
	facebookUrl: null,
};

describe("SocialLinksForm", () => {
	it("renders card title 'Redes sociais'", () => {
		render(<SocialLinksForm professional={professional as never} />);
		expect(screen.getByText("Redes sociais")).toBeInTheDocument();
	});

	it("renders card description", () => {
		render(<SocialLinksForm professional={professional as never} />);
		expect(screen.getByText(/Links exibidos/)).toBeInTheDocument();
	});

	it("renders all social link labels", () => {
		render(<SocialLinksForm professional={professional as never} />);
		expect(screen.getByText("Instagram")).toBeInTheDocument();
		expect(screen.getByText("LinkedIn")).toBeInTheDocument();
		expect(screen.getByText("Website")).toBeInTheDocument();
		expect(screen.getByText("Facebook")).toBeInTheDocument();
	});

	it("renders Salvar button", () => {
		render(<SocialLinksForm professional={professional as never} />);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});
});
