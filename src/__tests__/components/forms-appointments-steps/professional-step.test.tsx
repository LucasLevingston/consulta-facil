import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { ProfessionalResponse } from "@/features/professionals";

// O trigger do combobox (ProfessionalComboboxTrigger) não repassa as props
// injetadas pelo Radix (via PopoverTrigger asChild) para o <button> real, então
// o clique não alterna a abertura do Popover em jsdom. Mockamos o Popover para
// manter o conteúdo sempre visível e testar a lista/seleção de fato.
vi.mock("@/components/ui/popover", () => ({
	Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
	PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
	PopoverContent: ({ children }: { children: ReactNode }) => (
		<div>{children}</div>
	),
}));

// cmdk (usado por @/components/ui/command) mede a altura da lista via
// ResizeObserver e rola até o item selecionado via scrollIntoView — nenhum
// dos dois existe no jsdom, então adicionamos polyfills mínimos só para os testes.
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}
// biome-ignore lint: polyfill de teste
(global as any).ResizeObserver =
	(global as any).ResizeObserver ?? ResizeObserverMock;
if (!Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = () => {};
}

import { ProfessionalComboboxTrigger } from "@/components/forms/Appointments/steps/ProfessionalComboboxTrigger";
import { ProfessionalFormField } from "@/components/forms/Appointments/steps/ProfessionalFormField";
import { ProfessionalOption } from "@/components/forms/Appointments/steps/ProfessionalOption";
import { ProfessionalStep } from "@/components/forms/Appointments/steps/ProfessionalStep";
import { SelectedProfessionalCard } from "@/components/forms/Appointments/steps/SelectedProfessionalCard";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import type { UseAppointmentFormSetupReturn } from "@/features/appointments/hooks/use-appointment-form-setup";

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		userId: "u-1",
		name: "Dra. Ana Silva",
		specialty: "CARDIOLOGIA",
		licenseNumber: "CRM-12345",
		email: "ana@email.com",
		phone: "+5511999999999",
		rating: 4.8,
		consultationCount: 120,
		imageUrl: null,
		profession: "MEDICO",
		consultationPrice: 250,
		acceptedPaymentMethods: [],
		paymentTiming: null,
		city: "São Paulo",
		state: "SP",
		latitude: null,
		longitude: null,
		bio: null,
		status: "APPROVED",
		createdAt: "2026-01-01",
		...overrides,
	} as unknown as ProfessionalResponse;
}

describe("ProfessionalComboboxTrigger", () => {
	it("mostra o placeholder de busca quando nenhum profissional está selecionado", () => {
		render(
			<ProfessionalComboboxTrigger
				selected={null}
				open={false}
				disabled={false}
				hasValue={false}
			/>,
		);

		expect(screen.getByText("Buscar profissional...")).toBeInTheDocument();
	});

	it("mostra nome e especialidade do profissional selecionado", () => {
		render(
			<ProfessionalComboboxTrigger
				selected={makeProfessional()}
				open={false}
				disabled={false}
				hasValue={true}
			/>,
		);

		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("mostra as iniciais do profissional selecionado no avatar", () => {
		render(
			<ProfessionalComboboxTrigger
				selected={makeProfessional({ name: "João Pedro" })}
				open={false}
				disabled={false}
				hasValue={true}
			/>,
		);

		expect(screen.getByText("JP")).toBeInTheDocument();
	});

	it("desabilita o botão quando disabled é true", () => {
		render(
			<ProfessionalComboboxTrigger
				selected={null}
				open={false}
				disabled={true}
				hasValue={false}
			/>,
		);

		expect(screen.getByRole("combobox")).toBeDisabled();
	});
});

describe("ProfessionalOption", () => {
	function renderOption(
		props: Partial<Parameters<typeof ProfessionalOption>[0]> = {},
	) {
		return render(
			<Command>
				<CommandList>
					<CommandGroup>
						<ProfessionalOption
							professional={makeProfessional()}
							isSelected={false}
							onSelect={vi.fn()}
							{...props}
						/>
					</CommandGroup>
				</CommandList>
			</Command>,
		);
	}

	it("renderiza nome e especialidade do profissional", () => {
		renderOption();

		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("chama onSelect ao clicar na opção", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderOption({ onSelect });

		await user.click(screen.getByText("Dra. Ana Silva"));

		expect(onSelect).toHaveBeenCalledTimes(1);
	});
});

describe("SelectedProfessionalCard", () => {
	it("mostra nome e especialidade do profissional", () => {
		render(
			<SelectedProfessionalCard
				professional={makeProfessional()}
				showClear={false}
				onClear={vi.fn()}
			/>,
		);

		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("não mostra o botão de limpar quando showClear é false", () => {
		render(
			<SelectedProfessionalCard
				professional={makeProfessional()}
				showClear={false}
				onClear={vi.fn()}
			/>,
		);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("chama onClear ao clicar no botão de limpar quando showClear é true", async () => {
		const user = userEvent.setup();
		const onClear = vi.fn();
		render(
			<SelectedProfessionalCard
				professional={makeProfessional()}
				showClear={true}
				onClear={onClear}
			/>,
		);

		await user.click(screen.getByRole("button"));

		expect(onClear).toHaveBeenCalledTimes(1);
	});
});

describe("ProfessionalFormField", () => {
	function Wrapper({
		professionals,
		professionalsLoading = false,
		professionalIdParam = null,
		selectedProfessional,
		onProfessionalSelect = vi.fn(),
	}: {
		professionals: ProfessionalResponse[];
		professionalsLoading?: boolean;
		professionalIdParam?: string | null;
		selectedProfessional?: ProfessionalResponse;
		onProfessionalSelect?: () => void;
	}) {
		const form = useForm<{ professionalId: string }>({
			defaultValues: { professionalId: "" },
		});

		return (
			<FormProvider {...form}>
				<ProfessionalFormField
					control={form.control as never}
					professionals={professionals}
					professionalsLoading={professionalsLoading}
					professionalIdParam={professionalIdParam}
					selectedProfessional={selectedProfessional}
					onProfessionalSelect={onProfessionalSelect}
				/>
				<span data-testid="professional-id-value">
					{form.watch("professionalId")}
				</span>
			</FormProvider>
		);
	}

	it("mostra o placeholder de busca quando nenhum profissional está selecionado", () => {
		render(<Wrapper professionals={[makeProfessional()]} />);

		expect(screen.getByText("Buscar profissional...")).toBeInTheDocument();
	});

	it("mostra os profissionais disponíveis na lista", () => {
		const professionals = [
			makeProfessional({ id: "prof-1", name: "Dra. Ana Silva" }),
			makeProfessional({ id: "prof-2", name: "Dr. Carlos Souza" }),
		];
		render(<Wrapper professionals={professionals} />);

		expect(screen.getByText("Dr. Carlos Souza")).toBeInTheDocument();
	});

	it("mostra mensagem de nenhum profissional encontrado quando a lista está vazia", () => {
		render(<Wrapper professionals={[]} />);

		expect(
			screen.getByText("Nenhum profissional encontrado."),
		).toBeInTheDocument();
	});

	it("mostra mensagem de carregamento quando professionalsLoading é true", () => {
		render(<Wrapper professionals={[]} professionalsLoading={true} />);

		expect(screen.getByText("Carregando...")).toBeInTheDocument();
	});

	it("seleciona um profissional ao clicar na opção e propaga para o form", async () => {
		const user = userEvent.setup();
		const onProfessionalSelect = vi.fn();
		const professionals = [
			makeProfessional({ id: "prof-1", name: "Dra. Ana Silva" }),
			makeProfessional({ id: "prof-2", name: "Dr. Carlos Souza" }),
		];
		render(
			<Wrapper
				professionals={professionals}
				onProfessionalSelect={onProfessionalSelect}
			/>,
		);

		await user.click(screen.getByText("Dr. Carlos Souza"));

		expect(onProfessionalSelect).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId("professional-id-value")).toHaveTextContent(
			"prof-2",
		);
	});

	it("desabilita o combobox quando professionalIdParam está definido", () => {
		render(
			<Wrapper
				professionals={[makeProfessional()]}
				professionalIdParam="prof-1"
			/>,
		);

		expect(
			screen.getByText("Buscar profissional...").closest("button"),
		).toBeDisabled();
	});
});

describe("ProfessionalStep", () => {
	// ProfessionalStep não envolve o form em <Form>/<FormProvider> — isso é
	// feito pelo componente pai (AppointmentForm) — então o teste precisa
	// fornecer o contexto do react-hook-form manualmente.
	function Wrapper({
		hookOverrides = {},
		initialSpecialtyFilter,
	}: {
		hookOverrides?: Record<string, unknown>;
		initialSpecialtyFilter?: string;
	}) {
		const form = useForm<{ professionalId: string }>({
			defaultValues: { professionalId: "prof-1" },
		});

		const hook = {
			form,
			professionals: [],
			professionalsLoading: false,
			professionalIdParam: null,
			selectedProfessional: undefined,
			setSelectedTime: vi.fn(),
			setSelectedServiceId: vi.fn(),
			...hookOverrides,
		} as unknown as UseAppointmentFormSetupReturn;

		return (
			<FormProvider {...form}>
				<ProfessionalStep
					hook={hook}
					initialSpecialtyFilter={initialSpecialtyFilter}
				/>
				<span data-testid="professional-id-value">
					{form.watch("professionalId")}
				</span>
			</FormProvider>
		);
	}

	it("renderiza o título 'Escolha o profissional'", () => {
		render(<Wrapper />);

		expect(screen.getByText("Escolha o profissional")).toBeInTheDocument();
	});

	it("passa a lista completa de profissionais quando não há filtro de especialidade", () => {
		const professionals = [
			makeProfessional({
				id: "prof-1",
				name: "Dra. Ana Silva",
				specialty: "CARDIOLOGIA",
			}),
			makeProfessional({
				id: "prof-2",
				name: "Dr. Carlos Souza",
				specialty: "DERMATOLOGIA",
			}),
		];
		render(<Wrapper hookOverrides={{ professionals }} />);

		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
		expect(screen.getByText("Dr. Carlos Souza")).toBeInTheDocument();
	});

	it("filtra os profissionais pela especialidade inicial informada", () => {
		const professionals = [
			makeProfessional({
				id: "prof-1",
				name: "Dra. Ana Silva",
				specialty: "CARDIOLOGIA",
			}),
			makeProfessional({
				id: "prof-2",
				name: "Dr. Carlos Souza",
				specialty: "DERMATOLOGIA",
			}),
		];
		render(
			<Wrapper
				hookOverrides={{ professionals }}
				initialSpecialtyFilter="cardio"
			/>,
		);

		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
		expect(screen.queryByText("Dr. Carlos Souza")).not.toBeInTheDocument();
	});

	it("não renderiza o SelectedProfessionalCard quando nenhum profissional está selecionado", () => {
		render(<Wrapper hookOverrides={{ selectedProfessional: undefined }} />);

		expect(screen.queryByText("Dra. Ana Silva")).not.toBeInTheDocument();
	});

	it("renderiza o SelectedProfessionalCard quando há um profissional selecionado", () => {
		render(
			<Wrapper hookOverrides={{ selectedProfessional: makeProfessional() }} />,
		);

		// O nome e a especialidade aparecem tanto no trigger do combobox quanto
		// no card do profissional selecionado.
		expect(screen.getAllByText("Dra. Ana Silva")).toHaveLength(2);
		expect(screen.getAllByText("Cardiologia")).toHaveLength(2);
	});

	it("oculta o botão de limpar quando há professionalIdParam", () => {
		render(
			<Wrapper
				hookOverrides={{
					selectedProfessional: makeProfessional(),
					professionalIdParam: "prof-1",
				}}
			/>,
		);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("limpa a seleção ao clicar no botão de limpar do card selecionado", async () => {
		const user = userEvent.setup();
		const setSelectedTime = vi.fn();
		render(
			<Wrapper
				hookOverrides={{
					selectedProfessional: makeProfessional(),
					professionalIdParam: null,
					setSelectedTime,
				}}
			/>,
		);

		await user.click(screen.getByRole("button"));

		expect(setSelectedTime).toHaveBeenCalledWith("");
		expect(screen.getByTestId("professional-id-value")).toHaveTextContent("");
	});
});
