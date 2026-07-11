import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/forms/use-clinic-form", () => ({
	useClinicForm: vi.fn(),
}));

vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/custom/forms-components/custom-form-field", () => ({
	default: ({ name, label }: { name: string; label?: string }) => (
		<div data-testid={`field-${name}`}>{label ?? name}</div>
	),
	FormFieldType: {
		INPUT: "INPUT",
		TEXTAREA: "TEXTAREA",
	},
}));

vi.mock("@/components/custom/forms-components/custom-submit-button", () => ({
	CustomSubmitButton: ({ children }: { children: React.ReactNode }) => (
		<button type="submit">{children}</button>
	),
}));

vi.mock("@/components/custom/map/LocationPicker", () => ({
	LocationPicker: ({
		lat,
		lng,
		onLocationSelect,
	}: {
		lat: number | null;
		lng: number | null;
		onLocationSelect: (lat: number, lng: number) => void;
	}) => (
		<button
			type="button"
			data-testid="location-picker"
			data-lat={lat ?? ""}
			data-lng={lng ?? ""}
			onClick={() => onLocationSelect(-10, -20)}
		>
			selecionar localização
		</button>
	),
}));

import { ClinicForm } from "@/components/forms/ClinicForm";
import { useClinicForm } from "@/components/forms/use-clinic-form";

const mockUseClinicForm = vi.mocked(useClinicForm);

function makeHookReturn(
	overrides: Partial<ReturnType<typeof useClinicForm>> = {},
) {
	return {
		form: {
			control: {},
			formState: { isDirty: true },
		} as never,
		isEdit: false,
		lat: null,
		lng: null,
		handleLocationSelect: vi.fn(),
		onSubmit: vi.fn((e?: { preventDefault?: () => void }) => {
			e?.preventDefault?.();
		}),
		...overrides,
	} as ReturnType<typeof useClinicForm>;
}

describe("ClinicForm", () => {
	it("renderiza os campos básicos e de endereço", () => {
		mockUseClinicForm.mockReturnValue(makeHookReturn());
		render(<ClinicForm />);

		expect(screen.getByTestId("field-name")).toBeInTheDocument();
		expect(screen.getByTestId("field-description")).toBeInTheDocument();
		expect(screen.getByTestId("field-phone")).toBeInTheDocument();
		expect(screen.getByTestId("field-address")).toBeInTheDocument();
		expect(screen.getByTestId("field-zipCode")).toBeInTheDocument();
		expect(screen.getByTestId("field-city")).toBeInTheDocument();
		expect(screen.getByTestId("field-state")).toBeInTheDocument();
	});

	it("renderiza o LocationPicker com lat e lng vindos do hook", () => {
		mockUseClinicForm.mockReturnValue(
			makeHookReturn({ lat: -23.5, lng: -46.6 }),
		);
		render(<ClinicForm />);

		const picker = screen.getByTestId("location-picker");
		expect(picker).toHaveAttribute("data-lat", "-23.5");
		expect(picker).toHaveAttribute("data-lng", "-46.6");
	});

	it("exibe 'Criar clínica' quando não está em modo edição", () => {
		mockUseClinicForm.mockReturnValue(makeHookReturn({ isEdit: false }));
		render(<ClinicForm />);
		expect(screen.getByText("Criar clínica")).toBeInTheDocument();
	});

	it("exibe 'Salvar alterações' quando está em modo edição", () => {
		mockUseClinicForm.mockReturnValue(makeHookReturn({ isEdit: true }));
		render(<ClinicForm clinic={{ id: "c-1" } as never} />);
		expect(screen.getByText("Salvar alterações")).toBeInTheDocument();
	});

	it("chama onSubmit do hook ao submeter o formulário", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((e?: { preventDefault?: () => void }) => {
			e?.preventDefault?.();
		});
		mockUseClinicForm.mockReturnValue(makeHookReturn({ onSubmit }));
		render(<ClinicForm />);

		await user.click(screen.getByText("Criar clínica"));
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("chama handleLocationSelect com as coordenadas escolhidas no mapa", async () => {
		const user = userEvent.setup();
		const handleLocationSelect = vi.fn();
		mockUseClinicForm.mockReturnValue(makeHookReturn({ handleLocationSelect }));
		render(<ClinicForm />);

		await user.click(screen.getByTestId("location-picker"));
		expect(handleLocationSelect).toHaveBeenCalledWith(-10, -20);
	});
});
