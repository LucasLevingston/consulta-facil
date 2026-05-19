"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { themeFormSchema } from "./schemas";

export function ThemeForm() {
  const theme = useTheme();

  const form = useForm<z.infer<typeof themeFormSchema>>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      theme: theme.theme ?? "light",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    theme.setTheme(data.theme as "light" | "dark");
    toast.success("Sucesso", { description: `O tema foi alterado para: ${data.theme}` });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel>
                    <FormControl>
                      <RadioGroupItem value="light" className="hidden" />
                    </FormControl>
                    <div
                      className={`cursor-pointer items-center rounded-md border-[3px] p-1 hover:border-accent ${
                        field.value === "light" ? "border-primary" : "border-muted"
                      }`}
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

                <FormItem>
                  <FormLabel>
                    <FormControl>
                      <RadioGroupItem value="dark" className="hidden" />
                    </FormControl>
                    <div
                      className={`cursor-pointer items-center rounded-md border-[3px] p-1 hover:border-accent ${
                        field.value === "dark" ? "border-primary" : "border-muted"
                      }`}
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

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
