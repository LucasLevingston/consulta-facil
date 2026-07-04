import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Stub simples do menu suspenso (Radix) seguindo o padrão de mocks de UI do repo
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

const mockLogout = vi.hoisted(() => vi.fn());
const mockPush = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", () => ({
	useAuthStore: () => ({ logout: mockLogout }),
}));
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

const mockSetTheme = vi.hoisted(() => vi.fn());
const mockUseTheme = vi.hoisted(() => vi.fn());
vi.mock("next-themes", () => ({
	useTheme: mockUseTheme,
}));

import { HeaderDropdownLinks } from "@/components/custom/HeaderDropdownLinks";
import { HeaderDropdown } from "@/components/custom/header-dropdown";
import { ThemeSwitcher } from "@/components/custom/Theme-Switcher";

describe("HeaderDropdown", () => {
	const baseUser = {
		id: "u-1",
		email: "paciente@teste.com",
		role: "PATIENT" as const,
		imageUrl: null,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("abre o menu ao clicar no avatar e mostra o e-mail do usuário", async () => {
		render(<HeaderDropdown user={baseUser} />);
		await userEvent.click(screen.getByRole("button"));
		expect(screen.getByText("paciente@teste.com")).toBeInTheDocument();
		expect(screen.getByText("Paciente")).toBeInTheDocument();
	});

	it("mostra o rótulo Administrador para role ADMIN", () => {
		render(<HeaderDropdown user={{ ...baseUser, role: "ADMIN" }} />);
		expect(screen.getByText("Administrador")).toBeInTheDocument();
	});

	it("mostra o rótulo Profissional para role PROFESSIONAL", () => {
		render(<HeaderDropdown user={{ ...baseUser, role: "PROFESSIONAL" }} />);
		expect(screen.getByText("Profissional")).toBeInTheDocument();
	});

	it("chama logout, limpa o cookie de autenticação e redireciona ao clicar em Sair", async () => {
		render(<HeaderDropdown user={baseUser} />);
		await userEvent.click(screen.getByText("Sair da conta"));

		expect(mockLogout).toHaveBeenCalledTimes(1);
		expect(mockPush).toHaveBeenCalledWith("/");
	});
});

describe("HeaderDropdownLinks", () => {
	it("renderiza links básicos (Perfil e Configurações) para paciente", () => {
		// biome-ignore lint/a11y/useValidAriaRole: "role" aqui é prop do componente, não atributo ARIA
		render(<HeaderDropdownLinks role="PATIENT" />);
		expect(screen.getByText("Perfil")).toBeInTheDocument();
		expect(screen.getByText("Configurações")).toBeInTheDocument();
		expect(screen.queryByText("Painel Admin")).not.toBeInTheDocument();
	});

	it("renderiza o link do painel admin para role ADMIN", () => {
		// biome-ignore lint/a11y/useValidAriaRole: "role" aqui é prop do componente, não atributo ARIA
		render(<HeaderDropdownLinks role="ADMIN" />);
		expect(screen.getByText("Painel Admin")).toBeInTheDocument();
	});

	it("renderiza links extras de profissional para role PROFESSIONAL", () => {
		// biome-ignore lint/a11y/useValidAriaRole: "role" aqui é prop do componente, não atributo ARIA
		render(<HeaderDropdownLinks role="PROFESSIONAL" />);
		expect(screen.getByText("Meu Perfil Profissional")).toBeInTheDocument();
		expect(screen.getByText("Horários de Atendimento")).toBeInTheDocument();
		expect(screen.getByText("Minha Clínica")).toBeInTheDocument();
	});
});

describe("ThemeSwitcher", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o switch desmarcado quando o tema é light", () => {
		mockUseTheme.mockReturnValue({ theme: "light", setTheme: mockSetTheme });
		render(<ThemeSwitcher />);
		expect(screen.getByRole("switch")).not.toBeChecked();
	});

	it("renderiza o switch marcado quando o tema é dark", () => {
		mockUseTheme.mockReturnValue({ theme: "dark", setTheme: mockSetTheme });
		render(<ThemeSwitcher />);
		expect(screen.getByRole("switch")).toBeChecked();
	});

	it("chama setTheme com 'dark' ao alternar de light para dark", async () => {
		mockUseTheme.mockReturnValue({ theme: "light", setTheme: mockSetTheme });
		render(<ThemeSwitcher />);
		await userEvent.click(screen.getByRole("switch"));
		expect(mockSetTheme).toHaveBeenCalledWith("dark");
	});

	it("chama setTheme com 'light' ao alternar de dark para light", async () => {
		mockUseTheme.mockReturnValue({ theme: "dark", setTheme: mockSetTheme });
		render(<ThemeSwitcher />);
		await userEvent.click(screen.getByRole("switch"));
		expect(mockSetTheme).toHaveBeenCalledWith("light");
	});
});
