import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSetTheme = vi.hoisted(() => vi.fn());
const mockUseTheme = vi.hoisted(() => vi.fn());
vi.mock("next-themes", () => ({
	useTheme: mockUseTheme,
}));

import { ThemeSwitcher } from "./Theme-Switcher";

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
