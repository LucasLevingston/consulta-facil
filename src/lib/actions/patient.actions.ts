"use server";

import { prisma } from "@/lib/prisma";
import { RegisterPatientParams } from "@/types";

import {
  BUCKET_ID_DOCUMENT,
  BUCKET_ID_IMAGE,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";

import { createDocument } from "./bucket-actions/createDocument";
import { createImageProfile } from "./bucket-actions/createImageProfile";
import { getUser } from "./user.actions";

export const registerPatient = async ({
  identificationDocument,
  imageFile,
  ...patient
}: RegisterPatientParams) => {
  try {
    let uploadImageFile;
    let uploadDocumentFile;
    const existingPatientDetails = await prisma.patientDetails.findUnique({
      where: { userId: patient.id },
    });

    const documentId = existingPatientDetails?.identificationDocumentId;
    if (identificationDocument) {
      if (documentId)
        uploadDocumentFile = await createDocument(identificationDocument, documentId);
      else if (!documentId) createDocument(identificationDocument);
    }

    const imageId = existingPatientDetails?.imageProfileId;
    if (imageFile) {
      console.log(imageFile);
      if (imageId) uploadImageFile = await createImageProfile(imageFile, imageId);
      else if (!imageId) uploadImageFile = await createImageProfile(imageFile);
    }

    const user = await getUser(patient.id);
    if (!user) {
      throw new Error("User not found.");
    }

    const newPatientRecord = await prisma.user.update({
      where: { id: patient.id },
      data: {
        name: patient.name || user.name,
        email: patient.email || user.email,
        emailVerified: user.emailVerified,
        phone: patient.phone || user.phone,
        password: user.password,
        isDone: true,
        role: "patient",
        imageId: uploadImageFile?.$id || null,
        image: uploadImageFile?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_IMAGE}/files/${uploadImageFile.$id}/view?project=${PROJECT_ID}`
          : null,
        patientDetails: existingPatientDetails
          ? {
              update: {
                birthDate: patient.patientDetails.birthDate,
                gender: patient.patientDetails.gender,
                address: patient.patientDetails.address,
                occupation: patient.patientDetails.occupation,
                emergencyContactName: patient.patientDetails.emergencyContactName,
                emergencyContactNumber: patient.patientDetails.emergencyContactNumber,
                allergies: patient.patientDetails.allergies,
                currentMedication: patient.patientDetails.currentMedication,
                familyMedicalHistory: patient.patientDetails.familyMedicalHistory,
                pastMedicalHistory: patient.patientDetails.pastMedicalHistory,
                privacyConsent: patient.patientDetails.privacyConsent,
                cpf: patient.patientDetails.cpf,
                disclosureConsent: patient.patientDetails.disclosureConsent,
                treatmentConsent: patient.patientDetails.treatmentConsent,
                email: patient.patientDetails.email,
                phone: patient.patientDetails.phone,
                name: patient.patientDetails.name,
                imageProfileId: uploadImageFile?.$id || null,
                imageProfileUrl: uploadImageFile?.$id
                  ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_IMAGE}/files/${uploadImageFile.$id}/view?project=${PROJECT_ID}`
                  : null,
              },
            }
          : {
              create: {
                name: patient.patientDetails.name || user.name,
                email: patient.patientDetails.email || user.email,
                phone: patient.patientDetails.phone || user.phone,
                birthDate: patient.patientDetails.birthDate,
                gender: patient.patientDetails.gender,
                address: patient.patientDetails.address,
                occupation: patient.patientDetails.occupation,
                emergencyContactName: patient.patientDetails.emergencyContactName,
                emergencyContactNumber: patient.patientDetails.emergencyContactNumber,
                allergies: patient.patientDetails.allergies,
                currentMedication: patient.patientDetails.currentMedication,
                familyMedicalHistory: patient.patientDetails.familyMedicalHistory,
                pastMedicalHistory: patient.patientDetails.pastMedicalHistory,
                privacyConsent: patient.patientDetails.privacyConsent,
                cpf: patient.patientDetails.cpf,
                disclosureConsent: patient.patientDetails.disclosureConsent,
                treatmentConsent: patient.patientDetails.treatmentConsent,
                imageProfileId: uploadImageFile?.$id || null,
                imageProfileUrl: uploadImageFile?.$id
                  ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_IMAGE}/files/${uploadImageFile.$id}/view?project=${PROJECT_ID}`
                  : null,
                identificationDocumentId: uploadDocumentFile?.$id || null,
                identificationDocumentUrl: uploadDocumentFile?.$id
                  ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_DOCUMENT}/files/${uploadDocumentFile.$id}/view?project=${PROJECT_ID}`
                  : null,
              },
            },
      },
    });
    return newPatientRecord;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getPatient = async (patientId: string) => {
  return await prisma.patientDetails.findUnique({ where: { userId: patientId } });
};

export const getPatientByEmail = async (patientEmail: string) => {
  return await prisma.user.findUnique({
    where: { email: patientEmail },
  });
};
