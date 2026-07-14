import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MedicalConsentBadges } from "./MedicalConsentBadges";

describe("MedicalConsentBadges", () => {
	it("renders nothing when all consents are falsy", () => {
		const { container } = render(
			<MedicalConsentBadges
				privacyConsent={false}
				treatmentConsent={false}
				disclosureConsent={false}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders nothing when all props undefined", () => {
		const { container } = render(<MedicalConsentBadges />);
		expect(container.firstChild).toBeNull();
	});

	it("renders Privacidade badge when privacyConsent=true", () => {
		render(<MedicalConsentBadges privacyConsent={true} />);
		expect(screen.getByText("Privacidade")).toBeInTheDocument();
	});

	it("renders Tratamento badge when treatmentConsent=true", () => {
		render(<MedicalConsentBadges treatmentConsent={true} />);
		expect(screen.getByText("Tratamento")).toBeInTheDocument();
	});

	it("renders Divulgação badge when disclosureConsent=true", () => {
		render(<MedicalConsentBadges disclosureConsent={true} />);
		expect(screen.getByText("Divulgação")).toBeInTheDocument();
	});

	it("renders all 3 badges when all consents true", () => {
		render(
			<MedicalConsentBadges
				privacyConsent={true}
				treatmentConsent={true}
				disclosureConsent={true}
			/>,
		);
		expect(screen.getByText("Privacidade")).toBeInTheDocument();
		expect(screen.getByText("Tratamento")).toBeInTheDocument();
		expect(screen.getByText("Divulgação")).toBeInTheDocument();
	});
});
