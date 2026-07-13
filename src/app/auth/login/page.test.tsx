import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("@/components/auth/LoginContent", () => ({
	default: () => <div data-testid="login-content" />,
}));

import LoginPage from "./page";

describe("Login Page", () => {
	it("renders without crash", () => {
		render(<LoginPage />);
	});
});
