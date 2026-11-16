import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./UsersListContent", () => ({
	UsersListContent: () => <p>conteúdo de usuários</p>,
}));

import { UsersListView } from "./UsersListView";

describe("UsersListView", () => {
	it("renders the users list content", () => {
		render(<UsersListView />);

		expect(screen.getByText("conteúdo de usuários")).toBeInTheDocument();
	});
});
