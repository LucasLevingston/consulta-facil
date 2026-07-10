import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("./ServiceForm", () => ({
	ServiceForm: ({ onClose }: { onClose: () => void }) => (
		<div>
			ServiceForm-mock
			<button type="button" onClick={onClose}>
				fechar-mock
			</button>
		</div>
	),
}));
vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({
		children,
		open,
	}: {
		children: React.ReactNode;
		open: boolean;
	}) => (
		<div data-testid="dialog-root" data-open={open}>
			{children}
		</div>
	),
	DialogTrigger: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { NewServiceButton } from "./NewServiceButton";

describe("NewServiceButton", () => {
	it("renderiza o botão Novo serviço", () => {
		render(<NewServiceButton />);
		expect(
			screen.getByRole("button", { name: /Novo serviço/ }),
		).toBeInTheDocument();
	});

	it("dialog inicia fechado (open=false)", () => {
		render(<NewServiceButton />);
		expect(screen.getByTestId("dialog-root")).toHaveAttribute(
			"data-open",
			"false",
		);
	});

	it("abre o dialog do formulário ao clicar no botão", async () => {
		render(<NewServiceButton />);
		await userEvent.click(screen.getByRole("button", { name: /Novo serviço/ }));
		expect(screen.getByTestId("dialog-root")).toHaveAttribute(
			"data-open",
			"true",
		);
		expect(screen.getAllByText("Novo serviço")).toHaveLength(2);
		expect(screen.getByText("ServiceForm-mock")).toBeInTheDocument();
	});

	it("fecha o dialog quando o formulário chama onClose", async () => {
		render(<NewServiceButton />);
		await userEvent.click(screen.getByRole("button", { name: /Novo serviço/ }));
		await userEvent.click(screen.getByText("fechar-mock"));
		expect(screen.getByTestId("dialog-root")).toHaveAttribute(
			"data-open",
			"false",
		);
	});
});
