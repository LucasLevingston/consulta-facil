import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { PatientConsentSection } from "@/components/forms/PatientDetails/PatientConsentSection";

type ConsentValues = {
	treatmentConsent: boolean;
	disclosureConsent: boolean;
	privacyConsent: boolean;
};

function Harness({
	defaultValues,
}: {
	defaultValues?: Partial<ConsentValues>;
}) {
	const form = useForm<ConsentValues>({
		defaultValues: {
			treatmentConsent: false,
			disclosureConsent: false,
			privacyConsent: false,
			...defaultValues,
		},
	});
	return (
		<FormProvider {...form}>
			<PatientConsentSection form={form as never} />
			<span data-testid="treatment-value">
				{String(form.watch("treatmentConsent"))}
			</span>
		</FormProvider>
	);
}

describe("PatientConsentSection", () => {
	it("renderiza o título da seção de consentimento", () => {
		render(<Harness />);
		expect(screen.getByText("Consentimento e Privacidade")).toBeInTheDocument();
	});

	it("renderiza um item de formulário para cada um dos três consentimentos", () => {
		const { container } = render(<Harness />);
		// Cada CustomFormField gera um FormItem com a classe space-y-2
		expect(container.querySelectorAll(".space-y-2")).toHaveLength(3);
	});

	it("reflete os valores padrão dos consentimentos no form pai", () => {
		render(<Harness defaultValues={{ treatmentConsent: true }} />);
		expect(screen.getByTestId("treatment-value")).toHaveTextContent("true");
	});

	it.each([
		["treatmentConsent", "Você deve consentir com o tratamento."] as const,
		["disclosureConsent", "Você deve consentir com a divulgação."] as const,
		[
			"privacyConsent",
			"Você deve concordar com a política de privacidade.",
		] as const,
	])("exibe a mensagem de erro de %s quando o form possui esse erro", async (fieldName, message) => {
		function ErrorHarness() {
			const form = useForm<ConsentValues>({
				defaultValues: {
					treatmentConsent: false,
					disclosureConsent: false,
					privacyConsent: false,
				},
			});
			useEffect(() => {
				form.setError(fieldName, { message });
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [form.setError]);
			return (
				<FormProvider {...form}>
					<PatientConsentSection form={form as never} />
				</FormProvider>
			);
		}
		render(<ErrorHarness />);
		expect(await screen.findByText(message)).toBeInTheDocument();
	});
});
