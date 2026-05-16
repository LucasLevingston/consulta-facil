"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { FileUploader } from "@/components/FileUploader";
import SubmitButton from "@/components/SubmitButton";
import { Form, FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { GenderOptions, IdentificationTypes, specialties } from "@/constants";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

import { toast } from "@/hooks/use-toast";
import { registerDoctor } from "@/lib/actions/doctor.actions";
import { ExtendUser } from "@/next-auth";
import { Doctor } from "@/types";

import { getDefaultValues } from "./DefaultValues";
import { DoctorFormValidation } from "./FormValidation";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DoctorDetailsProps {
  user: ExtendUser;
  type: "edit" | "create";
}

function DoctorDetailsForm({ user, type }: DoctorDetailsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const defaultValues = getDefaultValues(user);

  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof DoctorFormValidation>) => {
    setIsLoading(true);

    try {
      let documentFormData;
      if (values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        });

        documentFormData = new FormData();
        documentFormData.append("blobFile", blobFile);
        documentFormData.append("fileName", values.identificationDocument[0].name);
      }
      let imageFormData;
      if (values.imageProfile && values.imageProfile.length > 0) {
        const blobFile = new Blob([values.imageProfile[0]], {
          type: values.imageProfile[0].type,
        });

        imageFormData = new FormData();
        imageFormData.append("blobFile", blobFile);
        imageFormData.append("fileName", values.imageProfile[0].name);
      }

      const doctor: Doctor = {
        id: user.id,
        emailVerified: user.emailVerified,
        isDone: user.isDone,
        role: user.role,
        image: user.image || null,
        password: user.password,
        doctorDetails: {
          userId: user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          birthDate: new Date(values.birthDate),
          specialty: values.specialty,
          licenseNumber: values.licenseNumber,
          identificationDocumentType: values.identificationDocumentType,
          identificationDocumentId: user.doctorDetails?.identificationDocumentId || null,
          identificationDocumentUrl:
            user.doctorDetails?.identificationDocumentUrl || null,
          cpf: values.cpf,
          privacyConsent: values.privacyConsent,
          address: values.address,
          gender: values.gender,
          imageProfileId: user.doctorDetails?.imageProfileId || null,
          imageProfileUrl: user.doctorDetails?.imageProfileUrl || null,
        },
      };

      const newDoctor = await registerDoctor({
        ...doctor,
        identificationDocument: values.identificationDocument
          ? documentFormData
          : undefined,
        imageFile: values.imageProfile ? imageFormData : undefined,
      });

      if (newDoctor) {
        toast({ title: "Dados salvos com sucesso!" });
        if (type === "create") {
          setTimeout(() => {
            router.push(`/`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao salvar os dados", variant: "destructive" });
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informações Pessoais</h2>
          </div>
          <div className="flex w-full items-center gap-6">
            <div className="flex min-w-[50%] flex-row gap-6 xl:flex-col">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Nome completo"
                placeholder="João da Silva"
                iconSrc="/assets/icons/user.svg"
                iconAlt="usuário"
              />{" "}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Endereço de E-mail"
                placeholder="joaodasilva@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />{" "}
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Número de Telefone"
                placeholder="+55 (85) 99123-4567"
              />
            </div>
            <div className="flex min-w-[50%] flex-row gap-6 xl:flex-col">
              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="imageProfile"
                label="Foto de perfil"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader
                      currentFile={user.image!!}
                      files={field.value}
                      onChange={field.onChange}
                      imageProfile
                    />
                  </FormControl>
                )}
              />{" "}
              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gênero"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option, i) => (
                        <div key={option.value + i} className="radio-group">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Data de Nascimento"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="cpf"
              label="CPF"
              placeholder="123456789"
            />
          </div>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Endereço"
            placeholder="Rua visconde neto 35 - Patos, PB"
          />
          <h2 className="sub-header">Informações pessoais</h2>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="specialty"
              label="Especialidade"
              placeholder="Cardiologia"
            >
              {specialties.map((speciality, i) => (
                <SelectItem key={speciality + i} value={speciality}>
                  {speciality}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="licenseNumber"
              label="Número da Licença"
              placeholder="123456"
            />
          </div>
        </section>
        {type === "create" && (
          <>
            <section>
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="identificationDocumentType"
                  label="Tipo de Identificação"
                  placeholder="Selecione o tipo de identificação"
                >
                  {IdentificationTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="identificationDocument"
                label="Cópia Escaneada do Documento de Identificação"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader files={field.value} onChange={field.onChange} />
                  </FormControl>
                )}
              />
            </section>
            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consentimento e Privacidade</h2>
              </div>

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="Eu reconheço que revisei e concordo com a política de privacidade."
              />
            </section>
          </>
        )}
        <SubmitButton isLoading={isLoading}>
          {type === "create" ? "Enviar e Continuar" : "Salvar"}
        </SubmitButton>{" "}
      </form>
    </Form>
  );
}

export default DoctorDetailsForm;
