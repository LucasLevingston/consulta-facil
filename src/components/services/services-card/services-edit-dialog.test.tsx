import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/services", () => ({}));
vi.mock("./ServiceForm", () => ({
	ServiceForm: ({ existing }: { existing: { name: string } }) => (
		<div>ServiceForm:{existing.name}</div>
	),
}));
vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div>{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { ServicesEditDialog } from "./ServicesEditDialog";

describe("ServicesEditDialog", () => {
	it("renders nothing when editing=null", () => {
		const { container } = render(
			<ServicesEditDialog
				editing={null}
				open={true}
				onOpenChange={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders nothing when open=false", () => {
		const { container } = render(
			<ServicesEditDialog
				editing={{ id: "s-1", name: "Ultrassom" } as never}
				open={false}
				onOpenChange={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders title and ServiceForm when open=true and editing provided", () => {
		render(
			<ServicesEditDialog
				editing={{ id: "s-1", name: "Ultrassom" } as never}
				open={true}
				onOpenChange={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Editar serviço")).toBeInTheDocument();
		expect(screen.getByText("ServiceForm:Ultrassom")).toBeInTheDocument();
	});
});
