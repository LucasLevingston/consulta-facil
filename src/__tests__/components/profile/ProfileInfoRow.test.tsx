import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import { describe, expect, it } from "vitest";

import { ProfileInfoRow } from "@/components/profile/ProfileInfoRow";

describe("ProfileInfoRow", () => {
	it("renderiza label e valor quando value é fornecido", () => {
		render(<ProfileInfoRow icon={Mail} label="E-mail" value="ana@teste.com" />);

		expect(screen.getByText("E-mail")).toBeInTheDocument();
		expect(screen.getByText("ana@teste.com")).toBeInTheDocument();
	});

	it("renderiza o ícone informado", () => {
		const { container } = render(
			<ProfileInfoRow icon={Mail} label="E-mail" value="ana@teste.com" />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("não renderiza nada quando value é undefined", () => {
		const { container } = render(
			<ProfileInfoRow icon={Mail} label="Telefone" value={undefined} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("não renderiza nada quando value é null", () => {
		const { container } = render(
			<ProfileInfoRow icon={Mail} label="Telefone" value={null} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("não renderiza nada quando value é string vazia", () => {
		const { container } = render(
			<ProfileInfoRow icon={Mail} label="Telefone" value="" />,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
