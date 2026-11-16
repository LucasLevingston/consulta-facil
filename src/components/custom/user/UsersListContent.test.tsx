import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/components/auth/hooks", () => ({ usePermission: vi.fn() }));
vi.mock("@/hooks/use-url-list-state", () => ({ useUrlListState: vi.fn() }));
const bodyProps = vi.hoisted(() => vi.fn());
vi.mock("./UsersListBody", () => ({
	UsersListBody: (props: unknown) => {
		bodyProps(props);
		return <div>corpo da lista</div>;
	},
}));

import { usePermission } from "@/components/auth/hooks";
import { useUrlListState } from "@/hooks/use-url-list-state";
import { UsersListContent } from "./UsersListContent";

describe("UsersListContent", () => {
	const updateParams = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useUrlListState).mockReturnValue({
			page: 2,
			get: (key: string) => ({ q: "ana", role: "ADMIN" })[key] ?? "",
			updateParams,
		} as never);
	});

	it("passes the URL state down to the list body", () => {
		vi.mocked(usePermission).mockReturnValue({ can: () => true } as never);

		render(<UsersListContent />);

		expect(screen.getByText("corpo da lista")).toBeInTheDocument();
		expect(bodyProps).toHaveBeenLastCalledWith({
			page: 2,
			roleFilter: "ADMIN",
			search: "ana",
			debouncedSearch: "ana",
			updateParams,
		});
		expect(push).not.toHaveBeenCalled();
	});

	it("sends non-admins back to the dashboard", () => {
		vi.mocked(usePermission).mockReturnValue({ can: () => false } as never);

		render(<UsersListContent />);

		expect(push).toHaveBeenCalledWith("/dashboard");
	});
});
