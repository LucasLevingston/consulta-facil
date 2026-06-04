import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/dashboard"),
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
vi.mock("@/store/useUserStore", () => ({
	useUserStore: vi.fn(),
}));

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/custom/bottom-nav";
import { useUserStore } from "@/store/useUserStore";

const mockUseUserStore = vi.mocked(useUserStore);
const mockUsePathname = vi.mocked(usePathname);

describe("BottomNav", () => {
	it("renders nothing when user is null", () => {
		mockUseUserStore.mockReturnValue({ user: null } as never);
		const { container } = render(<BottomNav />);
		expect(container.firstChild).toBeNull();
	});

	it("renders PATIENT nav items", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } } as never);
		render(<BottomNav />);
		expect(screen.getByText("Início")).toBeInTheDocument();
		expect(screen.getByText("Consultas")).toBeInTheDocument();
		expect(screen.getByText("Agendar")).toBeInTheDocument();
	});

	it("renders PROFESSIONAL nav items", () => {
		mockUseUserStore.mockReturnValue({
			user: { role: "PROFESSIONAL" },
		} as never);
		render(<BottomNav />);
		expect(screen.getByText("Pacientes")).toBeInTheDocument();
		expect(screen.getByText("Horários")).toBeInTheDocument();
	});

	it("renders RECEPTIONIST nav items", () => {
		mockUseUserStore.mockReturnValue({
			user: { role: "RECEPTIONIST" },
		} as never);
		render(<BottomNav />);
		expect(screen.getByText("Recepção")).toBeInTheDocument();
	});

	it("renders ADMIN nav items", () => {
		mockUseUserStore.mockReturnValue({ user: { role: "ADMIN" } } as never);
		render(<BottomNav />);
		expect(screen.getByText("Admin")).toBeInTheDocument();
	});

	it("highlights active route", () => {
		mockUsePathname.mockReturnValue("/dashboard");
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } } as never);
		render(<BottomNav />);
		const homeLink = screen.getByText("Início").closest("a");
		expect(homeLink?.className).toContain("text-primary");
	});

	it("does not highlight inactive route", () => {
		mockUsePathname.mockReturnValue("/dashboard");
		mockUseUserStore.mockReturnValue({ user: { role: "PATIENT" } } as never);
		render(<BottomNav />);
		const consultasLink = screen.getByText("Consultas").closest("a");
		expect(consultasLink?.className).not.toContain("text-primary");
	});
});
