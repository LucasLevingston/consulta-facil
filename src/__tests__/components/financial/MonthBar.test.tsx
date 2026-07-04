import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonthBar } from "@/components/financial/MonthBar";

describe("MonthBar", () => {
	it("renderiza o rotulo do mes e o valor formatado em BRL", () => {
		render(<MonthBar label="Jan" value={500} max={1000} />);

		expect(screen.getByText("Jan")).toBeInTheDocument();
		expect(screen.getByText(/R\$/)).toBeInTheDocument();
	});

	it("renderiza altura minima quando o valor e zero", () => {
		const { container } = render(<MonthBar label="Fev" value={0} max={1000} />);

		const bar = container.querySelector("div[style]");
		expect(bar).toHaveStyle({ height: "4%" });
	});

	it("renderiza altura de 100% quando o valor e igual ao maximo", () => {
		const { container } = render(
			<MonthBar label="Mar" value={1000} max={1000} />,
		);

		const bar = container.querySelector("div[style]");
		expect(bar).toHaveStyle({ height: "100%" });
	});
});
