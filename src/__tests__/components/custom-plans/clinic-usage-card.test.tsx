import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicUsageCard } from "@/components/custom/plans/ClinicUsageCard";
import type { ClinicResponse } from "@/features/clinics";
import { FREE_CONSULTS_PER_PROFESSIONAL } from "@/utils/constants/free-consults-per-professional";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

function makeClinic(overrides: Partial<ClinicResponse> = {}): ClinicResponse {
	return {
		id: "clinic-1",
		name: "Clínica Saúde Total",
		status: "ACTIVE",
		ownerId: "owner-1",
		...overrides,
	};
}

describe("ClinicUsageCard", () => {
	it("exibe o nome da clínica", () => {
		render(<ClinicUsageCard clinic={makeClinic({ name: "Clínica Vida" })} />);
		expect(screen.getByText("Clínica Vida")).toBeInTheDocument();
	});

	it("exibe a quantidade atual de profissionais em relação ao limite gratuito", () => {
		const clinic = makeClinic({
			members: [{ id: "m1" } as never, { id: "m2" } as never],
		});
		render(<ClinicUsageCard clinic={clinic} />);
		expect(screen.getByText(`2 / ${FREE_PROFESSIONALS}`)).toBeInTheDocument();
	});

	it("considera 1 profissional quando a clínica não possui membros", () => {
		render(<ClinicUsageCard clinic={makeClinic({ members: undefined })} />);
		expect(screen.getByText(`1 / ${FREE_PROFESSIONALS}`)).toBeInTheDocument();
	});

	it("exibe aviso de limite atingido quando profissionais >= limite gratuito", () => {
		const members = Array.from({ length: FREE_PROFESSIONALS }, (_, i) => ({
			id: `m${i}`,
		})) as never[];
		render(<ClinicUsageCard clinic={makeClinic({ members })} />);
		expect(
			screen.getByText(
				"Limite gratuito atingido — plano necessário para adicionar mais",
			),
		).toBeInTheDocument();
	});

	it("exibe vagas gratuitas restantes quando abaixo do limite", () => {
		const clinic = makeClinic({ members: [{ id: "m1" } as never] });
		render(<ClinicUsageCard clinic={clinic} />);
		expect(
			screen.getByText(`${FREE_PROFESSIONALS - 1} vagas gratuitas restantes`),
		).toBeInTheDocument();
	});

	it("calcula o total de consultas gratuitas com base na quantidade de profissionais", () => {
		const clinic = makeClinic({
			members: [{ id: "m1" } as never, { id: "m2" } as never],
		});
		render(<ClinicUsageCard clinic={clinic} />);
		expect(
			screen.getByText(String(2 * FREE_CONSULTS_PER_PROFESSIONAL)),
		).toBeInTheDocument();
	});
});
