import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfessionalsMap } from "@/components/custom/map/ProfessionalsMap";
import type { ProfessionalResponse } from "@/features/professionals";

vi.mock("next/dynamic", () => ({
	default: () => (props: Record<string, unknown>) => (
		<div
			data-testid="professionals-map-inner-stub"
			data-props={JSON.stringify(props)}
		/>
	),
}));

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		name: "Dra. Ana Souza",
		specialty: "CARDIOLOGY",
		...overrides,
	} as ProfessionalResponse;
}

describe("ProfessionalsMap", () => {
	it("renderiza sem quebrar usando a classe padrão", () => {
		const { container } = render(<ProfessionalsMap professionals={[]} />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass("h-[420px]", "w-full");
	});

	it("aplica a className customizada quando informada", () => {
		const { container } = render(
			<ProfessionalsMap professionals={[]} className="h-full custom-class" />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass("h-full", "custom-class");
	});

	it("repassa professionals, center e zoom para o componente interno do mapa", () => {
		const professionals = [makeProfessional()];
		render(
			<ProfessionalsMap
				professionals={professionals}
				center={[-23.5, -46.6]}
				zoom={8}
			/>,
		);
		const stub = screen.getByTestId("professionals-map-inner-stub");
		const props = JSON.parse(stub.getAttribute("data-props") ?? "{}");
		expect(props.professionals).toHaveLength(1);
		expect(props.center).toEqual([-23.5, -46.6]);
		expect(props.zoom).toBe(8);
	});
});
