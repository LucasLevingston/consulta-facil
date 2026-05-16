"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { GenderOptions, IdentificationTypes } from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { Patient } from "@/types";

import CustomFormField, { FormFieldType } from "../../CustomFormField";
import { FileUploader } from "../../FileUploader";
import SubmitButton from "../../SubmitButton";

import { getDefaultValues } from "./DefaultValues";
import { PatientFormValidation } from "./FormValidation";

import { toast } from "@/hooks/use-toast";

interface PatientDetailsProps {
  user: Patient;
  type: "edit" | "create";
}

const PatientDetailsForm = ({ user, type }: PatientDetailsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const defaultValues = getDefaultValues(user);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
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

      const patient: Patient = {
        id: user.id,
        emailVerified: user.emailVerified,
        isDone: user.isDone,
        role: user.role,
        image: user.image,
        password: user.password,
        patientDetails: {
          userId: user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          birthDate: new Date(values.birthDate),
          gender: values.gender,
          address: values.address,
          occupation: values.occupation,
          emergencyContactName: values.emergencyContactName,
          emergencyContactNumber: values.emergencyContactNumber,
          allergies: values.allergies || "",
          currentMedication: values.currentMedication || "",
          familyMedicalHistory: values.familyMedicalHistory || "",
          pastMedicalHistory: values.pastMedicalHistory || "",
          cpf: values.cpf,
          treatmentConsent: values.disclosureConsent,
          disclosureConsent: values.disclosureConsent,
          privacyConsent: values.privacyConsent,
          identificationDocumentType: values.identificationDocumentType,
          identificationDocumentId: user.patientDetails?.identificationDocumentId || null,
          identificationDocumentUrl:
            user.patientDetails?.identificationDocumentUrl || null,
          imageProfileId: user.patientDetails?.imageProfileId || null,
          imageProfileUrl: user.patientDetails?.imageProfileUrl || null,
        },
      };

      const newPatient = await registerPatient({
        ...patient,
        identificationDocument: values.identificationDocument
          ? documentFormData
          : undefined,
        imageFile: values.imageProfile ? imageFormData : undefined,
      });

      if (newPatient) {
        toast({ title: "Dados salvos com sucesso!" });
        if (type === "create") {
          setTimeout(() => {
            router.push(`/`);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
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
                placeholder="(555) 123-4567"
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
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="cpf"
            label="CPF"
            placeholder="123456789"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Endereço"
              placeholder="14 rua, Nova Iorque, NY - 5101"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Ocupação"
              placeholder="Engenheiro de Software"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Nome do Contato de Emergência"
              placeholder="Nome do responsável"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Número do Contato de Emergência"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informações Médicas</h2>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Alergias (se houver)"
              placeholder="Amendoins, Penicilina, Polen"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Medicações Atuais"
              placeholder="Ibuprofeno 200mg, Levotiroxina 50mcg"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label="Histórico Médico Familiar (se relevante)"
              placeholder="Mãe teve câncer cerebral, Pai tem hipertensão"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Histórico Médico Anterior"
              placeholder="Apendicectomia em 2015, Diagnóstico de asma na infância"
            />
          </div>
        </section>

        {type === "create" && (
          <>
            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identificação e Verificação</h2>
              </div>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Tipo de Identificação"
                placeholder="Selecione o tipo de identificação"
              >
                {IdentificationTypes.map((type, i) => (
                  <SelectItem key={type + i} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </CustomFormField>

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
                name="treatmentConsent"
                label="Eu consinto em receber tratamento para minha condição de saúde."
              />

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="Eu consinto com o uso e divulgação das minhas informações de saúde para fins de tratamento."
              />

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
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PatientDetailsForm;
