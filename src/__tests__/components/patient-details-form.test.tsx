import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/patients", () => ({
	useUpdateMyProfile: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
	PatientFormValidation: { _def: {} },
}));
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
vi.mock("react-datepicker/dist/react-datepicker.css", () => ({}));
vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/forms/PatientDetails/PatientPersonalSection", () => ({
	PatientPersonalSection: () => <div>personal-section</div>,
}));
vi.mock("@/components/forms/PatientDetails/PatientMedicalSection", () => ({
	PatientMedicalSection: () => <div>medical-section</div>,
}));
vi.mock(
	"@/components/forms/PatientDetails/PatientIdentificationSection",
	() => ({
		PatientIdentificationSection: () => <div>identification-section</div>,
	}),
);
vi.mock("@/components/forms/PatientDetails/PatientConsentSection", () => ({
	PatientConsentSection: () => <div>consent-section</div>,
}));
vi.mock("@/components/custom/forms-components/custom-submit-button", () => ({
	CustomSubmitButton: ({ children }: { children: React.ReactNode }) => (
		<button type="submit">{children}</button>
	),
}));

import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";

const defaultData = { name: "Test", email: "test@test.com" };

describe("PatientDetailsForm render", () => {
	it("renders personal and medical sections", () => {
		render(
			<PatientDetailsForm
				userId="u-1"
				userEmail="test@test.com"
				type="edit"
				defaultData={defaultData as never}
			/>,
		);
		expect(screen.getByText("personal-section")).toBeInTheDocument();
		expect(screen.getByText("medical-section")).toBeInTheDocument();
	});

	it("renders Salvar button for edit type", () => {
		render(
			<PatientDetailsForm
				userId="u-1"
				userEmail="test@test.com"
				type="edit"
				defaultData={defaultData as never}
			/>,
		);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});
});
