import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { createUser, signInWithCreds } from "@/lib/actions/user.actions";
import { UserFormValidation, LoginFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { SelectItem } from "../ui/select";

export const UserForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: undefined,
      password: "",
    },
  });

  const loginForm = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRegisterSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      await createUser(values);

      toast({ title: "Registro feito com sucesso!" });

      const logInResponse = await signInWithCreds({
        email: values.email,
        password: values.password,
      });

      if (logInResponse) {
        setTimeout(() => {
          router.push(`/auth/completar-cadastro`);
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: error.message || "Erro desconhecido ao fazer registro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const onClick = () => {
  //   signInWithGoogle();
  // };

  const onLoginSubmit = async (values: z.infer<typeof LoginFormValidation>) => {
    setIsLoading(true);
    try {
      const response = await signInWithCreds({
        email: values.email,
        password: values.password,
      });

      toast({ title: "Login feito com sucesso!" });
      if (response) {
        setTimeout(() => {
          if (response) {
            if (!response.isDone) return router.push(`/auth/completar-cadastro`);
            else router.push(`/`);
          }
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: error.message || "Erro desconhecido ao fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="register" className="flex w-full max-w-md flex-col gap-4">
      <TabsList className="grid w-full grid-cols-2 ">
        <TabsTrigger value="register" className="font-bold">
          Registrar
        </TabsTrigger>
        <TabsTrigger value="login" className="font-bold">
          Entrar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="flex-1 space-y-6"
          >
            <section className="space-y-4">
              <h1 className="header">Olá 👋</h1>
              <p className="text-dark-700">Comece a agendar consultas.</p>
            </section>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={registerForm.control}
              name="name"
              label="Nome Completo"
              placeholder="João da Silva"
              iconSrc="/assets/icons/user.svg"
              iconAlt="usuário"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={registerForm.control}
              name="email"
              label="E-mail"
              placeholder="joaodasilva@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={registerForm.control}
              name="password"
              label="Senha"
              placeholder="********"
              iconSrc="/assets/icons/lock.svg"
              iconAlt="senha"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={registerForm.control}
              name="phone"
              label="Número de Telefone"
              placeholder="(555) 123-4567"
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={registerForm.control}
              name="role"
              label="Tipo"
              placeholder="Selecione seu cargo"
            >
              <SelectItem value={"patient"} className="text-white">
                <div className="flex cursor-pointer items-center gap-2 ">
                  <p>Paciente</p>
                </div>
              </SelectItem>
              <SelectItem value={"doctor"} className="text-white">
                <div className="flex cursor-pointer items-center gap-2">
                  <p>Médico</p>
                </div>
              </SelectItem>
            </CustomFormField>
            {/* <Button onClick={() => onClick()} className="text-sm">
              <FcGoogle size="lg" />
            </Button> */}
            <SubmitButton isLoading={isLoading}>Registrar</SubmitButton>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="login">
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="flex-1 space-y-6"
          >
            <section className="space-y-4">
              <h1 className="header">Bem-vindo de volta 👋</h1>
              <p className="text-dark-700">Entre para agendar consultas.</p>
            </section>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={loginForm.control}
              name="email"
              label="E-mail"
              placeholder="joaodasilva@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={loginForm.control}
              name="password"
              label="Senha"
              placeholder="********"
              iconSrc="/assets/icons/lock.svg"
              iconAlt="senha"
            />

            <SubmitButton isLoading={isLoading}>Entrar</SubmitButton>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};
