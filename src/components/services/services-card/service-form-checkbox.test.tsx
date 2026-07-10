import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { CreateServiceInput } from "@/features/services";

vi.mock("@/components/ui/checkbox", () => ({
	Checkbox: ({
		checked,
		onCheckedChange,
		...props
	}: {
		checked?: boolean;
		onCheckedChange?: (v: boolean) => void;
	} & Record<string, unknown>) => (
		<input
			type="checkbox"
			checked={!!checked}
			onChange={(e) => onCheckedChange?.(e.target.checked)}
			{...props}
		/>
	),
}));

import { ServiceFormCheckbox } from "./ServiceFormCheckbox";

function CheckboxHarness({
	defaultValues,
}: {
	defaultValues?: Partial<CreateServiceInput>;
}) {
	const form = useForm<CreateServiceInput>({
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			durationMinutes: 30,
			requiresConsultation: false,
			...defaultValues,
		},
	});
	return (
		<div>
			<ServiceFormCheckbox form={form} />
			<span data-testid="requires-value">
				{String(form.watch("requiresConsultation"))}
			</span>
		</div>
	);
}

describe("ServiceFormCheckbox", () => {
	it("renderiza o label Requer consulta prévia desmarcado por padrão", () => {
		render(<CheckboxHarness />);
		expect(screen.getByText("Requer consulta prévia")).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).not.toBeChecked();
		expect(screen.getByTestId("requires-value")).toHaveTextContent("false");
	});

	it("marcar o checkbox propaga true para o form pai", async () => {
		render(<CheckboxHarness />);
		await userEvent.click(screen.getByRole("checkbox"));
		expect(screen.getByTestId("requires-value")).toHaveTextContent("true");
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("renderiza marcado quando o valor inicial é true", () => {
		render(<CheckboxHarness defaultValues={{ requiresConsultation: true }} />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});
});
