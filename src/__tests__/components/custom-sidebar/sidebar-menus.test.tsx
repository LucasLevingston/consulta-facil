import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Stubs simples dos primitivos de UI do sidebar (Radix) — mesmo padrão usado
// em outros testes do repo (ex: header-theme.test.tsx) para evitar depender
// de contexto interno (useSidebar) que exigiria um SidebarProvider real.
vi.mock("@/components/ui/sidebar", () => ({
	SidebarContent: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar-content">{children}</div>
	),
	SidebarGroup: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SidebarMenu: ({ children }: { children: React.ReactNode }) => (
		<ul>{children}</ul>
	),
	SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
		<li>{children}</li>
	),
	SidebarMenuButton: ({
		children,
		isActive,
		size,
		className,
	}: {
		children: React.ReactNode;
		isActive?: boolean;
		size?: string;
		className?: string;
	}) => (
		<button
			type="button"
			data-active={isActive}
			data-size={size}
			className={className}
		>
			{children}
		</button>
	),
	SidebarSeparator: () => <hr data-testid="sidebar-separator" />,
	SidebarFooter: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar-footer">{children}</div>
	),
}));

vi.mock("@/components/ui/avatar", () => ({
	Avatar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="avatar">{children}</div>
	),
	AvatarImage: () => null,
	AvatarFallback: ({ children }: { children: React.ReactNode }) => (
		<span data-testid="avatar-fallback">{children}</span>
	),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
	DropdownMenu: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
		<div role="menu">{children}</div>
	),
	DropdownMenuItem: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		asChild?: boolean;
	}) => (
		<button type="button" role="menuitem" onClick={onClick}>
			{children}
		</button>
	),
	DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DropdownMenuSeparator: () => <hr />,
	DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

vi.mock("@/components/ui/separator", () => ({
	Separator: () => <hr data-testid="ui-separator" />,
}));

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

import { SidebarFooterMenu } from "@/components/custom/sidebar/SidebarFooterMenu";
import { SidebarNavContent } from "@/components/custom/sidebar/SidebarNavContent";
import { SidebarUserDropdown } from "@/components/custom/sidebar/SidebarUserDropdown";

function FakeIcon(props: React.SVGProps<SVGSVGElement>) {
	return <svg data-testid="icon" {...props} />;
}

describe("SidebarNavContent", () => {
	const navigation = [
		{
			label: "Início",
			items: [
				{ title: "Dashboard", url: "/dashboard", icon: FakeIcon },
				{ title: "Perfil", url: "/dashboard/profile", icon: FakeIcon },
			],
		},
		{
			label: "Configurações",
			items: [{ title: "Config", url: "/settings", icon: FakeIcon }],
		},
	];

	it("renderiza os labels dos grupos e os títulos dos itens", () => {
		render(
			<SidebarNavContent navigation={navigation} isActive={() => false} />,
		);
		expect(screen.getByText("Início")).toBeInTheDocument();
		expect(screen.getByText("Configurações")).toBeInTheDocument();
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Perfil")).toBeInTheDocument();
		expect(screen.getByText("Config")).toBeInTheDocument();
	});

	it("cada item vira um link apontando para a url correta", () => {
		render(
			<SidebarNavContent navigation={navigation} isActive={() => false} />,
		);
		expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
			"href",
			"/dashboard",
		);
		expect(screen.getByText("Config").closest("a")).toHaveAttribute(
			"href",
			"/settings",
		);
	});

	it("marca como ativo apenas o item cuja url corresponde a isActive", () => {
		render(
			<SidebarNavContent
				navigation={navigation}
				isActive={(url) => url === "/dashboard"}
			/>,
		);
		const dashboardButton = screen.getByText("Dashboard").closest("button");
		const perfilButton = screen.getByText("Perfil").closest("button");
		expect(dashboardButton).toHaveAttribute("data-active", "true");
		expect(perfilButton).toHaveAttribute("data-active", "false");
	});

	it("renderiza um separador para cada grupo de navegação", () => {
		render(
			<SidebarNavContent navigation={navigation} isActive={() => false} />,
		);
		expect(screen.getAllByTestId("sidebar-separator")).toHaveLength(
			navigation.length,
		);
	});

	it("renderiza vazio (sem grupos) quando a navegação é uma lista vazia", () => {
		render(<SidebarNavContent navigation={[]} isActive={() => false} />);
		expect(screen.queryAllByTestId("sidebar-separator")).toHaveLength(0);
	});
});

describe("SidebarFooterMenu", () => {
	const baseProps = {
		displayName: "Ana Souza",
		initials: "AS",
		imageUrl: null,
		email: "ana@teste.com",
		isAdmin: false,
		isProfessional: false,
		isReceptionist: false,
		onLogout: vi.fn(),
	};

	it("exibe o nome do usuário e as iniciais do avatar", () => {
		render(<SidebarFooterMenu {...baseProps} />);
		// "Ana Souza" aparece tanto no botão de trigger quanto no dropdown interno
		// (SidebarUserDropdown real, não mockado neste teste).
		expect(screen.getAllByText("Ana Souza").length).toBeGreaterThan(0);
		expect(screen.getAllByText("AS").length).toBeGreaterThan(0);
	});

	it("exibe o rótulo 'Paciente' quando nenhuma flag de role está ativa", () => {
		render(<SidebarFooterMenu {...baseProps} />);
		expect(screen.getByText("Paciente")).toBeInTheDocument();
	});

	it("exibe o rótulo 'Administrador' quando isAdmin é true", () => {
		render(<SidebarFooterMenu {...baseProps} isAdmin />);
		expect(screen.getByText("Administrador")).toBeInTheDocument();
	});

	it("exibe o rótulo 'Profissional' quando isProfessional é true", () => {
		render(<SidebarFooterMenu {...baseProps} isProfessional />);
		expect(screen.getByText("Profissional")).toBeInTheDocument();
	});

	it("exibe o rótulo 'Recepcionista' quando isReceptionist é true", () => {
		render(<SidebarFooterMenu {...baseProps} isReceptionist />);
		expect(screen.getByText("Recepcionista")).toBeInTheDocument();
	});

	it("abre o menu suspenso do usuário com o e-mail", async () => {
		render(<SidebarFooterMenu {...baseProps} />);
		expect(screen.getByRole("menu")).toBeInTheDocument();
		expect(screen.getByText("ana@teste.com")).toBeInTheDocument();
	});
});

describe("SidebarUserDropdown", () => {
	const baseProps = {
		displayName: "Ana Souza",
		initials: "AS",
		imageUrl: null,
		email: "ana@teste.com",
		isProfessional: false,
		onLogout: vi.fn(),
	};

	it("exibe nome e e-mail do usuário", () => {
		render(<SidebarUserDropdown {...baseProps} />);
		expect(screen.getByText("Ana Souza")).toBeInTheDocument();
		expect(screen.getByText("ana@teste.com")).toBeInTheDocument();
	});

	it("exibe os links 'Meu Perfil' e 'Configurações'", () => {
		render(<SidebarUserDropdown {...baseProps} />);
		expect(screen.getByText("Meu Perfil").closest("a")).toHaveAttribute(
			"href",
			"/dashboard/profile",
		);
		expect(screen.getByText("Configurações").closest("a")).toHaveAttribute(
			"href",
			"/settings",
		);
	});

	it("não exibe os links de assinatura/plano quando isProfessional é false", () => {
		render(<SidebarUserDropdown {...baseProps} />);
		expect(screen.queryByText("Assinatura Pro")).not.toBeInTheDocument();
		expect(screen.queryByText("Plano Clínica")).not.toBeInTheDocument();
	});

	it("exibe os links de assinatura/plano quando isProfessional é true", () => {
		render(<SidebarUserDropdown {...baseProps} isProfessional />);
		expect(screen.getByText("Assinatura Pro").closest("a")).toHaveAttribute(
			"href",
			"/settings/billing",
		);
		expect(screen.getByText("Plano Clínica").closest("a")).toHaveAttribute(
			"href",
			"/settings/billing/clinic",
		);
	});

	it("chama onLogout ao clicar em 'Sair da conta'", async () => {
		const onLogout = vi.fn();
		render(<SidebarUserDropdown {...baseProps} onLogout={onLogout} />);
		await userEvent.click(screen.getByText("Sair da conta"));
		expect(onLogout).toHaveBeenCalledTimes(1);
	});
});
