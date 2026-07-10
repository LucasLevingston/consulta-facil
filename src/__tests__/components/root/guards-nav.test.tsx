import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth", () => ({
	usePermission: vi.fn(),
	useUserStore: vi.fn(),
}));
vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
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
vi.mock("@/components/custom/custom-button", () => ({
	CustomButton: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		[key: string]: unknown;
	}) => <button {...props}>{children}</button>,
}));
vi.mock("@/components/custom/header-dropdown", () => ({
	HeaderDropdown: ({ user }: { user: { email: string } }) => (
		<div data-testid="header-dropdown">{user.email}</div>
	),
}));
vi.mock("@/components/custom/notifications/NotificationBell", () => ({
	NotificationBell: () => <div data-testid="notification-bell" />,
}));
vi.mock("@/components/custom/theme-switcher", () => ({
	ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));
vi.mock("@/components/logo", () => ({
	Logo: () => <div data-testid="logo" />,
}));

import { Home, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { AbacGuard } from "@/components/AbacGuard";
import { Header } from "@/components/Header";
import type { NavItem } from "@/components/Header.nav";
import { HeaderNav } from "@/components/HeaderNav";
import { usePermission, useUserStore } from "@/features/auth";

const mockUsePermission = vi.mocked(usePermission);
const mockUseUserStore = vi.mocked(useUserStore);
const mockUsePathname = vi.mocked(usePathname);

describe("AbacGuard", () => {
	it("renderiza os children quando a permissão é concedida", () => {
		mockUsePermission.mockReturnValue({ can: () => true } as never);
		render(
			<AbacGuard permission={"dashboard:view" as never}>
				<span>conteudo protegido</span>
			</AbacGuard>,
		);
		expect(screen.getByText("conteudo protegido")).toBeInTheDocument();
	});

	it("não renderiza os children quando a permissão é negada (sem fallback)", () => {
		mockUsePermission.mockReturnValue({ can: () => false } as never);
		const { container } = render(
			<AbacGuard permission={"dashboard:view" as never}>
				<span>conteudo protegido</span>
			</AbacGuard>,
		);
		expect(screen.queryByText("conteudo protegido")).not.toBeInTheDocument();
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o fallback quando a permissão é negada", () => {
		mockUsePermission.mockReturnValue({ can: () => false } as never);
		render(
			<AbacGuard
				permission={"dashboard:view" as never}
				fallback={<span>sem acesso</span>}
			>
				<span>conteudo protegido</span>
			</AbacGuard>,
		);
		expect(screen.getByText("sem acesso")).toBeInTheDocument();
	});

	it("passa os attrs recebidos para a função can", () => {
		const can = vi.fn(() => true);
		mockUsePermission.mockReturnValue({ can } as never);
		render(
			<AbacGuard
				permission={"dashboard:view" as never}
				attrs={{ ownerId: "1" }}
			>
				<span>conteudo</span>
			</AbacGuard>,
		);
		expect(can).toHaveBeenCalledWith("dashboard:view", { ownerId: "1" });
	});
});

describe("HeaderNav", () => {
	const items: NavItem[] = [
		{ title: "Dashboard", url: "/dashboard", icon: Home },
		{ title: "Profissionais", url: "/professionals", icon: Users },
	];

	it("renderiza todos os itens de navegação", () => {
		render(<HeaderNav items={items} isActive={() => false} />);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Profissionais")).toBeInTheDocument();
	});

	it("aplica estilo ativo ao item correspondente à rota atual", () => {
		render(
			<HeaderNav items={items} isActive={(url) => url === "/dashboard"} />,
		);
		const activeLink = screen.getByText("Dashboard").closest("a");
		const inactiveLink = screen.getByText("Profissionais").closest("a");
		expect(activeLink?.className).toContain("text-primary");
		expect(inactiveLink?.className).not.toContain("text-primary");
	});

	it("usa a url do item como href do link", () => {
		render(<HeaderNav items={items} isActive={() => false} />);
		const link = screen.getByRole("link", { name: /Profissionais/ });
		expect(link).toHaveAttribute("href", "/professionals");
	});
});

describe("Header", () => {
	it("não renderiza a navegação nem o dropdown quando não há usuário logado", () => {
		mockUseUserStore.mockReturnValue({ user: null } as never);
		mockUsePathname.mockReturnValue("/");
		render(<Header />);
		expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
		expect(screen.queryByTestId("header-dropdown")).not.toBeInTheDocument();
	});

	it("renderiza os links de login e criar conta quando não há usuário", () => {
		mockUseUserStore.mockReturnValue({ user: null } as never);
		mockUsePathname.mockReturnValue("/");
		render(<Header />);
		expect(screen.getByText("Entrar")).toBeInTheDocument();
		expect(screen.getByText("Criar conta")).toBeInTheDocument();
	});

	it("renderiza a navegação e o dropdown quando há usuário logado", () => {
		mockUseUserStore.mockReturnValue({
			user: { role: "PATIENT", email: "user@test.com" },
		} as never);
		mockUsePathname.mockReturnValue("/dashboard");
		render(<Header />);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByTestId("header-dropdown")).toHaveTextContent(
			"user@test.com",
		);
	});

	it("renderiza itens específicos do role do usuário", () => {
		mockUseUserStore.mockReturnValue({
			user: { role: "PROFESSIONAL", email: "prof@test.com" },
		} as never);
		mockUsePathname.mockReturnValue("/dashboard");
		render(<Header />);
		expect(screen.getByText("Pacientes")).toBeInTheDocument();
		expect(screen.getByText("Financeiro")).toBeInTheDocument();
	});

	it("renderiza sino de notificações e theme switcher", () => {
		mockUseUserStore.mockReturnValue({
			user: { role: "PATIENT", email: "user@test.com" },
		} as never);
		mockUsePathname.mockReturnValue("/dashboard");
		render(<Header />);
		expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
		expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
	});
});
