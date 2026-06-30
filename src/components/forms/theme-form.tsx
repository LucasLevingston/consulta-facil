"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { themeFormSchema } from "@/lib/schemas/theme/theme-form.schema";
import { cn } from "@/lib/utils/cn";

export function ThemeForm() {
	const { theme, setTheme } = useTheme();

	const form = useForm<z.infer<typeof themeFormSchema>>({
		resolver: zodResolver(themeFormSchema),
		defaultValues: {
			theme: (theme as "light" | "dark") ?? "light",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		setTheme(data.theme);

		toast.success("Sucesso", {
			description: `O tema foi alterado para: ${data.theme}`,
		});
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-6">
				<FormField
					control={form.control}
					name="theme"
					render={({ field }) => (
						<FormItem className="space-y-4">
							<FormMessage />

							<RadioGroup
								value={field.value}
								onValueChange={field.onChange}
								className="grid max-w-md grid-cols-2 gap-8 pt-2"
							>
								{/* Light */}
								<FormItem>
									<FormLabel className="cursor-pointer">
										<FormControl>
											<RadioGroupItem value="light" className="hidden" />
										</FormControl>

										<div
											className={cn(
												"rounded-md border-[3px] p-1 transition-colors",
												field.value === "light"
													? "border-primary"
													: "border-muted",
											)}
										>
											<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
												<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
													<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
													<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
												</div>

												<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
													<div className="size-4 rounded-full bg-[#ecedef]" />
													<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
												</div>

												<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
													<div className="size-4 rounded-full bg-[#ecedef]" />
													<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
												</div>
											</div>
										</div>

										<span className="block w-full p-2 text-center font-normal">
											Light
										</span>
									</FormLabel>
								</FormItem>

								{/* Dark */}
								<FormItem>
									<FormLabel className="cursor-pointer">
										<FormControl>
											<RadioGroupItem value="dark" className="hidden" />
										</FormControl>

										<div
											className={cn(
												"rounded-md border-[3px] p-1 transition-colors",
												field.value === "dark"
													? "border-primary"
													: "border-muted",
											)}
										>
											<div className="space-y-2 rounded-sm bg-slate-950 p-2">
												<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
													<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
													<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
												</div>

												<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
													<div className="size-4 rounded-full bg-slate-400" />
													<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
												</div>

												<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
													<div className="size-4 rounded-full bg-slate-400" />
													<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
												</div>
											</div>
										</div>

										<span className="block w-full p-2 text-center font-normal">
											Dark
										</span>
									</FormLabel>
								</FormItem>
							</RadioGroup>
						</FormItem>
					)}
				/>

				<CustomSubmitButton form={form}>
					{form.formState.isSubmitting ? "Salvando..." : "Salvar alterações"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
