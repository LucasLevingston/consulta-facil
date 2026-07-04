import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DependentCard } from "@/components/dependents/DependentCard";
import type { DependentResponse } from "@/features/dependents";

const dep: DependentResponse = {
	id: "dep-1",
	name: "Pedro Silva",
	cpf: "123.456.789-00",
	birthDate: "2000-01-01",
	gender: "MALE",
	relationship: "CHILD",
};

describe("DependentCard", () => {
	it("renders dependent name", () => {
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText("Pedro Silva")).toBeInTheDocument();
	});

	it("renders relationship label", () => {
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText("Filho(a)")).toBeInTheDocument();
	});

	it("renders CPF", () => {
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText(/123\.456\.789-00/)).toBeInTheDocument();
	});

	it("renders gender label", () => {
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText(/Masculino/)).toBeInTheDocument();
	});

	it("edit button calls onEdit", async () => {
		const onEdit = vi.fn();
		render(
			<DependentCard
				dependent={dep}
				onEdit={onEdit}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		await userEvent.click(screen.getAllByRole("button")[0]);
		expect(onEdit).toHaveBeenCalledWith(dep);
	});

	it("delete button calls onDelete", async () => {
		const onDelete = vi.fn();
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={onDelete}
				deleting={false}
			/>,
		);
		await userEvent.click(screen.getAllByRole("button")[1]);
		expect(onDelete).toHaveBeenCalledWith("dep-1");
	});

	it("delete button disabled when deleting=true", () => {
		render(
			<DependentCard
				dependent={dep}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={true}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[1]).toBeDisabled();
	});

	it("shows Sem CPF when cpf is null", () => {
		render(
			<DependentCard
				dependent={{ ...dep, cpf: null }}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				deleting={false}
			/>,
		);
		expect(screen.getByText(/Sem CPF/)).toBeInTheDocument();
	});
});
