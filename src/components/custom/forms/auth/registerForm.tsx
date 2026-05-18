"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import CustomFormField, {
  FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { type RegisterInput, registerSchema } from "@/lib/schemas/auth.schema";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => Promise<void>;
  isPending: boolean;
  className?: string;
}

export function RegisterForm({ onSubmit, isPending, className }: RegisterFormProps) {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            form={form}
            fieldType={FormFieldType.INPUT}
            name="name"
          />
          <CustomFormField
            form={form}
            fieldType={FormFieldType.INPUT}
            name="cpf"
          />
        </div>

        <CustomFormField
          form={form}
          fieldType={FormFieldType.EMAIL}
          name="email"
        />
        <CustomFormField
          form={form}
          fieldType={FormFieldType.PASSWORD}
          name="password"
        />
        <CustomFormField
          form={form}
          fieldType={FormFieldType.PASSWORD}
          name="confirmPassword"
        />

        <CustomSubmitButton form={form} submittingText="Registrando..." disabled={isPending}>
          Registrar
        </CustomSubmitButton>

        <p className="text-center text-sm text-zinc-400">
          Já possui uma conta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Faça seu login
          </Link>
        </p>
      </form>
    </Form>
  );
}
