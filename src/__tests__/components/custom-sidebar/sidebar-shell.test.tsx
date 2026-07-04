import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// --- Mocks compartilhados para AppSidebar ---

const mockCookiesRemove = vi.hoisted(() => vi.fn());
vi.mock("js-cookie", () => ({
	default: { remove: mockCookiesRemove },
}));

const mockUsePathname = vi.hoisted(() => vi.fn(() => "/dashboard"));
const mockPush = vi.hoisted(() => vi.fn());
const mockUseRouter = vi.hoisted(() => vi.fn(() => ({ push: mockPush })));
vi.mock("next/navigation", () => ({
	usePathname: mockUsePathname,
	useRouter: mockUseRouter,
}));

vi.mock("@/components/logo", () => ({
	Logo: () => <div data-testid="logo">Logo</div>,
}));

// Evita side-effects reais de registro de navegação (registrations/*.nav.ts)
vi.mock("@/lib/nav/load-nav", () => ({}));

vi.mock("@/components/ui/sidebar", () => ({
	Sidebar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar">{children}</div>
	),
	SidebarHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SidebarMenu: ({ children }: { children: React.ReactNode }) => (
		<ul>{children}</ul>
	),
	SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
		<li>{children}</li>
	),
	SidebarRail: () => <div data-testid="sidebar-rail" />,
}));

const mockUseAuthStore = vi.hoisted(() => vi.fn());
const mockUseUserStore = vi.hoisted(() => vi.fn());
vi.mock("@/features/auth", () => ({
	useAuthStore: mockUseAuthStore,
	useUserStore: mockUseUserStore,
}));

const mockGetNavGroupsForRole = vi.hoisted(() => vi.fn(() => []));
vi.mock("@/lib/nav/nav-registry", () => ({
	getNavGroupsForRole: mockGetNavGroupsForRole,
}));

const capturedNavProps = vi.hoisted(() => ({
	current: null as null | Record<string, unknown>,
}));
vi.mock("@/components/custom/sidebar/SidebarNavContent", () => ({
	SidebarNavContent: (props: Record<string, unknown>) => {
		capturedNavProps.current = props;
		return <div data-testid="nav-content" />;
	},
}));

const mockLogout = vi.hoisted(() => vi.fn());
vi.mock("@/components/custom/sidebar/SidebarFooterMenu", () => ({
	SidebarFooterMenu: (props: { displayName: string; onLogout: () => void }) => (
		<div data-testid="footer-menu">
			<span>{props.displayName}</span>
			<button type="button" onClick={props.onLogout}>
				Sair
			</button>
		</div>
	),
}));

import AppSidebar from "@/components/custom/sidebar/app-sidebar";
import { SettingsSidebar } from "@/components/custom/sidebar/settings-sidebar";

function setupAppSidebar({
	isAuthenticated = true,
	user = {
		id: "u-1",
		role: "PATIENT",
		name: "Ana Souza",
		email: "ana@teste.com",
		imageUrl: null,
	} as Record<string, unknown> | null,
} = {}) {
	mockUseAuthStore.mockReturnValue({
		isAuthenticated,
		logout: mockLogout,
	});
	mockUseUserStore.mockReturnValue({ user });
}

describe("AppSidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUsePathname.mockReturnValue("/dashboard");
		mockUseRouter.mockReturnValue({ push: mockPush });
		mockGetNavGroupsForRole.mockReturnValue([]);
		capturedNavProps.current = null;
	});

	it("renderiza o conteúdo de navegação e o rodapé quando autenticado", async () => {
		setupAppSidebar();
		render(<AppSidebar />);
		await waitFor(() =>
			expect(screen.getByTestId("nav-content")).toBeInTheDocument(),
		);
		expect(screen.getByTestId("footer-menu")).toBeInTheDocument();
		expect(screen.getByText("Ana Souza")).toBeInTheDocument();
	});

	it("não renderiza o rodapé quando o usuário não está autenticado", async () => {
		setupAppSidebar({ isAuthenticated: false });
		render(<AppSidebar />);
		await waitFor(() =>
			expect(screen.getByTestId("nav-content")).toBeInTheDocument(),
		);
		expect(screen.queryByTestId("footer-menu")).not.toBeInTheDocument();
	});

	it("não renderiza o rodapé quando não há usuário mesmo autenticado", async () => {
		setupAppSidebar({ isAuthenticated: true, user: null });
		render(<AppSidebar />);
		await waitFor(() =>
			expect(screen.getByTestId("nav-content")).toBeInTheDocument(),
		);
		expect(screen.queryByTestId("footer-menu")).not.toBeInTheDocument();
	});

	it("usa a role PATIENT como padrão quando o usuário não possui role definida", async () => {
		setupAppSidebar({ user: { id: "u-1", email: "ana@teste.com" } });
		render(<AppSidebar />);
		await waitFor(() =>
			expect(mockGetNavGroupsForRole).toHaveBeenCalledWith("PATIENT"),
		);
	});

	it("busca os grupos de navegação para a role do usuário (ADMIN)", async () => {
		setupAppSidebar({
			user: { id: "u-1", role: "ADMIN", email: "admin@teste.com" },
		});
		render(<AppSidebar />);
		await waitFor(() =>
			expect(mockGetNavGroupsForRole).toHaveBeenCalledWith("ADMIN"),
		);
	});

	it("chama logout, remove o cookie de autenticação e redireciona para /auth ao sair", async () => {
		setupAppSidebar();
		render(<AppSidebar />);
		await waitFor(() =>
			expect(screen.getByTestId("footer-menu")).toBeInTheDocument(),
		);
		screen.getByText("Sair").click();
		expect(mockLogout).toHaveBeenCalledTimes(1);
		expect(mockCookiesRemove).toHaveBeenCalledWith("auth_token");
		expect(mockPush).toHaveBeenCalledWith("/auth");
	});

	it("isActive considera exatamente '/dashboard' como raiz e prefixo para as demais rotas", async () => {
		mockUsePathname.mockReturnValue("/dashboard/appointments");
		setupAppSidebar();
		render(<AppSidebar />);
		await waitFor(() => expect(capturedNavProps.current).not.toBeNull());
		const isActive = capturedNavProps.current?.isActive as (
			url: string,
		) => boolean;
		expect(isActive("/dashboard")).toBe(false);
		expect(isActive("/dashboard/appointments")).toBe(true);
	});

	it("isActive marca '/dashboard' como ativo apenas quando o caminho é exatamente '/dashboard'", async () => {
		mockUsePathname.mockReturnValue("/dashboard");
		setupAppSidebar();
		render(<AppSidebar />);
		await waitFor(() => expect(capturedNavProps.current).not.toBeNull());
		const isActive = capturedNavProps.current?.isActive as (
			url: string,
		) => boolean;
		expect(isActive("/dashboard")).toBe(true);
	});
});

// --- Mocks para SettingsSidebar ---

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

describe("SettingsSidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUsePathname.mockReturnValue("/settings");
	});

	it("renderiza os links básicos disponíveis para todas as roles", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } });
		render(<SettingsSidebar />);
		expect(screen.getByText("Meu perfil")).toBeInTheDocument();
		expect(screen.getByText("Tema")).toBeInTheDocument();
	});

	it("não renderiza links restritos a PROFESSIONAL para um PATIENT", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } });
		render(<SettingsSidebar />);
		expect(screen.queryByText("Horários")).not.toBeInTheDocument();
		expect(screen.queryByText("Minha Clínica")).not.toBeInTheDocument();
		expect(screen.queryByText("Serviços")).not.toBeInTheDocument();
	});

	it("renderiza links extras de PROFESSIONAL (Horários, Minha Clínica, Serviços)", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "PROFESSIONAL" } });
		render(<SettingsSidebar />);
		expect(screen.getByText("Horários")).toBeInTheDocument();
		expect(screen.getByText("Minha Clínica")).toBeInTheDocument();
		expect(screen.getByText("Serviços")).toBeInTheDocument();
	});

	it("renderiza 'Plano da Clínica' para ADMIN mas não 'Horários'", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "ADMIN" } });
		render(<SettingsSidebar />);
		expect(screen.getByText("Plano da Clínica")).toBeInTheDocument();
		expect(screen.queryByText("Horários")).not.toBeInTheDocument();
	});

	it("usa PATIENT como padrão quando não há usuário logado", () => {
		mockUseUserStore.mockReturnValue({ user: undefined });
		render(<SettingsSidebar />);
		expect(screen.getByText("Meu perfil")).toBeInTheDocument();
		expect(screen.queryByText("Horários")).not.toBeInTheDocument();
	});

	it("aplica a classe de destaque ao link cujo href corresponde à rota atual", () => {
		mockUsePathname.mockReturnValue("/settings/wallet");
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } });
		render(<SettingsSidebar />);
		expect(screen.getByText("Carteira").closest("a")?.className).toContain(
			"bg-primary/10",
		);
		expect(screen.getByText("Tema").closest("a")?.className).not.toContain(
			"bg-primary/10",
		);
	});
});
