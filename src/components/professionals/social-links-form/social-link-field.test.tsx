import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { SocialLinkField } from "./SocialLinkField";

describe("SocialLinkField", () => {
	type Values = { instagramUrl?: string };

	function Harness({ defaultValues }: { defaultValues?: Values }) {
		const form = useForm<Values>({ defaultValues });
		return (
			<FormProvider {...form}>
				<SocialLinkField
					control={form.control as never}
					name="instagramUrl"
					label="Instagram"
					placeholder="https://instagram.com/..."
					icon={<Mail data-testid="icon" />}
				/>
				<span data-testid="value">{form.watch("instagramUrl")}</span>
			</FormProvider>
		);
	}

	it("renderiza o label e o ícone", () => {
		render(<Harness />);
		expect(screen.getByText("Instagram")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(<Harness defaultValues={{ instagramUrl: "https://insta/x" }} />);
		expect(
			screen.getByPlaceholderText("https://instagram.com/..."),
		).toHaveValue("https://insta/x");
	});

	it("propaga a digitação para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("https://instagram.com/...");
		await userEvent.type(input, "https://insta/novo");
		expect(screen.getByTestId("value")).toHaveTextContent("https://insta/novo");
	});
});
