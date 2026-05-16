import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";

// Definindo o schema de validação com Zod
const contactSchema = z.object({
  name: z.string().min(5, "Digite o nome"),
  email: z.string().email("Digite o email"),
  message: z.string().min(1, "Digite a mensagem"),
});

export function ContactSection() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    console.log(values);
  }

  return (
    <section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Entre em Contato
        </h2>
        <div className="mx-auto max-w-md">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <CustomFormField
                name="name"
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Nome"
                placeholder="Digite seu nome"
              />
              <CustomFormField
                name="email"
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Email"
                placeholder="Digite seu email"
              />
              <CustomFormField
                name="message"
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Mensagem"
                placeholder="Digite sua mensagem"
              />

              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
