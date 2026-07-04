import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicsMap } from "@/components/custom/map/ClinicsMap";
import type { ClinicResponse } from "@/features/clinics";

vi.mock("next/dynamic", () => ({
	default: () => (props: Record<string, unknown>) => (
		<div
			data-testid="clinics-map-inner-stub"
			data-props={JSON.stringify(props)}
		/>
	),
}));

function makeClinic(overrides: Partial<ClinicResponse> = {}): ClinicResponse {
	return {
		id: "clinic-1",
		name: "Clínica Saúde Total",
		status: "ACTIVE",
		ownerId: "owner-1",
		...overrides,
	};
}

describe("ClinicsMap", () => {
	it("renderiza sem quebrar usando a classe padrão", () => {
		const { container } = render(<ClinicsMap clinics={[]} />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass("h-[420px]", "w-full");
	});

	it("aplica a className customizada quando informada", () => {
		const { container } = render(
			<ClinicsMap clinics={[]} className="h-full custom-class" />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass("h-full", "custom-class");
	});

	it("repassa clinics, center e zoom para o componente interno do mapa", () => {
		const clinics = [makeClinic()];
		render(<ClinicsMap clinics={clinics} center={[-23.5, -46.6]} zoom={10} />);
		const stub = screen.getByTestId("clinics-map-inner-stub");
		const props = JSON.parse(stub.getAttribute("data-props") ?? "{}");
		expect(props.clinics).toHaveLength(1);
		expect(props.center).toEqual([-23.5, -46.6]);
		expect(props.zoom).toBe(10);
	});
});
