import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./hooks", () => ({ useAllUsers: vi.fn() }));
vi.mock("@/components/custom/user/UserRoleCard", () => ({
	UserRoleCard: ({ user }: { user: { name: string } }) => (
		<p>card {user.name}</p>
	),
}));
vi.mock("@/components/custom/custom-pagination", () => ({
	CustomPagination: ({
		onPageChange,
	}: {
		onPageChange: (p: number) => void;
	}) => (
		<button type="button" onClick={() => onPageChange(2)}>
			próxima página
		</button>
	),
}));
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<select
			aria-label="tipo"
			value={value}
			onChange={(e) => onValueChange?.(e.target.value)}
		>
			{children}
		</select>
	),
	SelectTrigger: () => null,
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <option value={value}>{children}</option>,
}));

import { useAllUsers } from "./hooks";
import { UsersListBody } from "./UsersListBody";

const users = [
	{ id: "1", name: "Ana Souza", email: "ana@example.com" },
	{ id: "2", name: "Bruno Lima", email: "bruno@clinica.com" },
];

function renderBody(overrides: Record<string, unknown> = {}) {
	const props = {
		page: 0,
		roleFilter: "",
		search: "",
		debouncedSearch: "",
		updateParams: vi.fn(),
		...overrides,
	};
	render(<UsersListBody {...props} />);
	return props;
}

describe("UsersListBody", () => {
	beforeEach(() => {
		vi.mocked(useAllUsers).mockReturnValue({
			data: { content: users, totalElements: 2, totalPages: 3 },
		} as never);
	});

	it("loads the page for the current role filter and lists the users", () => {
		renderBody({ page: 1, roleFilter: "ADMIN" });

		expect(useAllUsers).toHaveBeenCalledWith(1, expect.any(Number), "ADMIN");
		expect(screen.getByText("card Ana Souza")).toBeInTheDocument();
		expect(screen.getByText("card Bruno Lima")).toBeInTheDocument();
	});

	it("requests every role when no filter is set", () => {
		renderBody();

		expect(useAllUsers).toHaveBeenCalledWith(0, expect.any(Number), undefined);
	});

	it("filters the page by name or email (case-insensitive)", () => {
		renderBody({ debouncedSearch: "CLINICA" });

		expect(screen.getByText("card Bruno Lima")).toBeInTheDocument();
		expect(screen.queryByText("card Ana Souza")).not.toBeInTheDocument();
	});

	it("shows an empty state when nothing matches", () => {
		renderBody({ debouncedSearch: "zzz" });

		expect(screen.getByText("Nenhum usuário encontrado.")).toBeInTheDocument();
	});

	it("writes the search, role and page to the URL", async () => {
		const { updateParams } = renderBody();

		await userEvent.type(
			screen.getByPlaceholderText("Buscar por nome ou email..."),
			"a",
		);
		expect(updateParams).toHaveBeenCalledWith({ q: "a" });

		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: "tipo" }),
			"PATIENT",
		);
		expect(updateParams).toHaveBeenCalledWith({ role: "PATIENT" });

		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: "tipo" }),
			"ALL",
		);
		expect(updateParams).toHaveBeenCalledWith({ role: null });

		await userEvent.click(
			screen.getByRole("button", { name: "próxima página" }),
		);
		expect(updateParams).toHaveBeenCalledWith({ page: "2" }, false);
	});
});
