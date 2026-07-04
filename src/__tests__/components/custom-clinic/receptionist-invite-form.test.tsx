import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	default: ({ name, label }: { name: string; label?: string }) => (
		<div data-testid={`field-${name}`}>{label ?? name}</div>
	),
	FormFieldType: { EMAIL: "EMAIL" },
}));
vi.mock("@/components/custom/forms-components/custom-submit-button", () => ({
	CustomSubmitButton: ({ children }: { children: React.ReactNode }) => (
		<button type="submit">{children}</button>
	),
}));

import { ReceptionistInviteForm } from "@/components/custom/clinic/ReceptionistInviteForm";

function makeForm() {
	return {} as never;
}

describe("ReceptionistInviteForm", () => {
	it("renderiza o campo de e-mail", () => {
		render(
			<ReceptionistInviteForm
				form={makeForm()}
				onSubmit={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);
		expect(screen.getByTestId("field-email")).toBeInTheDocument();
	});

	it("renderiza os botões 'Adicionar' e 'Cancelar'", () => {
		render(
			<ReceptionistInviteForm
				form={makeForm()}
				onSubmit={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);
		expect(screen.getByText("Adicionar")).toBeInTheDocument();
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("chama onSubmit ao submeter o formulário", () => {
		const onSubmit = vi.fn((e) => e.preventDefault());
		render(
			<ReceptionistInviteForm
				form={makeForm()}
				onSubmit={onSubmit}
				onCancel={vi.fn()}
			/>,
		);
		const form = screen.getByText("Adicionar").closest("form");
		expect(form).not.toBeNull();
		if (form) {
			form.addEventListener("submit", (e) => e.preventDefault());
		}
		form?.dispatchEvent(
			new Event("submit", { bubbles: true, cancelable: true }),
		);
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("chama onCancel ao clicar em 'Cancelar'", async () => {
		const user = userEvent.setup();
		const onCancel = vi.fn();
		render(
			<ReceptionistInviteForm
				form={makeForm()}
				onSubmit={vi.fn()}
				onCancel={onCancel}
			/>,
		);
		await user.click(screen.getByText("Cancelar"));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
