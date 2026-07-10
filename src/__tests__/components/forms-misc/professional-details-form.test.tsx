import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock(
	"@/components/forms/ProfessionalDetails/use-professional-details-form",
	() => ({
		useProfessionalDetailsForm: vi.fn(),
	}),
);

vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	default: ({
		form,
		name,
		label,
		placeholder,
		fieldType,
		disabled,
		selectOptions,
	}: {
		form: { setValue: (name: string, value: unknown) => void };
		name: string;
		label?: string;
		placeholder?: string;
		fieldType: string;
		disabled?: boolean;
		selectOptions?: { value: string; label: string }[];
	}) => {
		if (fieldType === "SELECT") {
			return (
				<button
					type="button"
					disabled={disabled}
					data-testid={`field-${name}`}
					onClick={() => form.setValue(name, selectOptions?.[0]?.value)}
				>
					{label ?? name}
					{placeholder ? `:${placeholder}` : ""}
				</button>
			);
		}
		return <div data-testid={`field-${name}`}>{label ?? name}</div>;
	},
	FormFieldType: {
		INPUT: "INPUT",
		EMAIL: "EMAIL",
		PASSWORD: "PASSWORD",
		TEXTAREA: "TEXTAREA",
		SELECT: "SELECT",
		DATE_PICKER: "DATE_PICKER",
		CHECKBOX: "CHECKBOX",
	},
}));

vi.mock("@/components/custom/forms-components/custom-submit-button", () => ({
	CustomSubmitButton: ({ children }: { children: React.ReactNode }) => (
		<button type="submit">{children}</button>
	),
}));

import ProfessionalDetailsForm from "@/components/forms/ProfessionalDetails/ProfessionalDetailsForm";
import { ProfessionalPersonalFields } from "@/components/forms/ProfessionalDetails/ProfessionalPersonalFields";
import { useProfessionalDetailsForm } from "@/components/forms/ProfessionalDetails/use-professional-details-form";

const mockUseProfessionalDetailsForm = vi.mocked(useProfessionalDetailsForm);

const baseForm = {
	control: {},
	setValue: vi.fn(),
	handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
		e.preventDefault();
		fn({});
	},
} as never;

function makeHookReturn(
	overrides: Partial<ReturnType<typeof useProfessionalDetailsForm>> = {},
) {
	return {
		form: baseForm,
		selectedProfession: "",
		professionOptions: [{ value: "MEDICO", label: "MEDICO" }],
		specialtyOptions: [],
		onSubmit: vi.fn(),
		isPending: false,
		type: "create",
		...overrides,
	} as ReturnType<typeof useProfessionalDetailsForm>;
}

describe("ProfessionalPersonalFields", () => {
	it("renderiza o título e todos os campos pessoais", () => {
		render(<ProfessionalPersonalFields form={baseForm} />);

		expect(screen.getByText("Informações Pessoais")).toBeInTheDocument();
		expect(screen.getByTestId("field-name")).toBeInTheDocument();
		expect(screen.getByTestId("field-email")).toBeInTheDocument();
		expect(screen.getByTestId("field-phone")).toBeInTheDocument();
		expect(screen.getByTestId("field-gender")).toBeInTheDocument();
		expect(screen.getByTestId("field-birthDate")).toBeInTheDocument();
		expect(screen.getByTestId("field-cpf")).toBeInTheDocument();
		expect(screen.getByTestId("field-address")).toBeInTheDocument();
	});
});

describe("ProfessionalDetailsForm", () => {
	it("renderiza as seções pessoal e profissional com seus campos", () => {
		mockUseProfessionalDetailsForm.mockReturnValue(makeHookReturn());
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="create"
			/>,
		);

		expect(screen.getByText("Informações Pessoais")).toBeInTheDocument();
		expect(screen.getByText("Informações Profissionais")).toBeInTheDocument();
		expect(screen.getByTestId("field-profession")).toBeInTheDocument();
		expect(screen.getByTestId("field-specialty")).toBeInTheDocument();
		expect(screen.getByTestId("field-licenseNumber")).toBeInTheDocument();
	});

	it("desabilita o campo de especialidade quando nenhuma profissão está selecionada", () => {
		mockUseProfessionalDetailsForm.mockReturnValue(
			makeHookReturn({ selectedProfession: "" }),
		);
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="create"
			/>,
		);

		expect(screen.getByTestId("field-specialty")).toBeDisabled();
	});

	it("habilita o campo de especialidade quando uma profissão está selecionada", () => {
		mockUseProfessionalDetailsForm.mockReturnValue(
			makeHookReturn({
				selectedProfession: "MEDICO",
				specialtyOptions: [{ value: "CARDIOLOGIA", label: "CARDIOLOGIA" }],
			}),
		);
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="create"
			/>,
		);

		expect(screen.getByTestId("field-specialty")).not.toBeDisabled();
	});

	it("exibe o texto 'Enviar e Continuar' no botão quando type é create", () => {
		mockUseProfessionalDetailsForm.mockReturnValue(
			makeHookReturn({ type: "create" }),
		);
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="create"
			/>,
		);

		expect(screen.getByText("Enviar e Continuar")).toBeInTheDocument();
	});

	it("exibe o texto 'Salvar' no botão quando type é edit", () => {
		mockUseProfessionalDetailsForm.mockReturnValue(
			makeHookReturn({ type: "edit" }),
		);
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="edit"
			/>,
		);

		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("chama onSubmit do hook ao submeter o formulário", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		mockUseProfessionalDetailsForm.mockReturnValue(
			makeHookReturn({ onSubmit }),
		);
		render(
			<ProfessionalDetailsForm
				userId="u-1"
				userEmail="ana@teste.com"
				type="create"
			/>,
		);

		await user.click(screen.getByText("Enviar e Continuar"));
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});
