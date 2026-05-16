"use server";

import { prisma } from "@/lib/prisma";
import { RegisterDoctorParams } from "@/types";

import {
  BUCKET_ID_DOCUMENT,
  BUCKET_ID_IMAGE,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";

import { createDocument } from "./bucket-actions/createDocument";
import { createImageProfile } from "./bucket-actions/createImageProfile";
import { getUser } from "./user.actions";

export const registerDoctor = async ({
  identificationDocument,
  imageFile,
  ...doctor
}: RegisterDoctorParams) => {
  try {
    let uploadImageFile;
    let uploadDocumentFile;

    const existingDoctorDetails = await prisma.doctorDetails.findUnique({
      where: { userId: doctor.id },
    });

    if (identificationDocument) {
      uploadDocumentFile = await createDocument(identificationDocument);
    }
    if (imageFile) {
      uploadImageFile = await createImageProfile(imageFile);
    }

    const user = await getUser(doctor.id);
    if (!user) {
      throw new Error("User not found.");
    }

    const newDoctorRecord = await prisma.user.update({
      where: { id: doctor.id },
      data: {
        name: doctor.name || user.name,
        email: doctor.email || user.email,
        emailVerified: user.emailVerified,
        phone: doctor.phone || user.phone,
        password: user.password,
        isDone: true,
        role: "doctor",
        imageId: uploadImageFile?.$id || null,
        image: uploadImageFile?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_IMAGE}/files/${uploadImageFile.$id}/view?project=${PROJECT_ID}`
          : null,
        doctorDetails: existingDoctorDetails
          ? {
              update: {
                licenseNumber: doctor.doctorDetails.licenseNumber || null,
                specialty: doctor.doctorDetails.specialty,
                birthDate: doctor.doctorDetails.birthDate,
                gender: doctor.doctorDetails.gender,
                address: doctor.doctorDetails.address,
                privacyConsent: doctor.doctorDetails.privacyConsent,
                cpf: doctor.doctorDetails.cpf,
                email: doctor.doctorDetails.email,
                phone: doctor.doctorDetails.phone,
                name: doctor.doctorDetails.name,
                imageProfileId: uploadImageFile?.$id || null,
                imageProfileUrl: uploadImageFile?.$id
                  ? `${ENDPOINT}/storage/buckets/${BUCKET_ID_IMAGE}/files/${uploadImageFile.$id}/view?project=${PROJECT_ID}`
                  : null,
              },
            }
          : {
              create: {
                email: user.email,
                phone: user.phone,
                name: user.name,
                cpf: doctor.doctorDetails.cpf,
                address: doctor.doctorDetails.cpf,
                identificationDocumentType:
                  doctor.doctorDetails.identificationDocumentType,
                licenseNumber: doctor.doctorDetails.licenseNumber || null,
                specialty: doctor.doctorDetails.specialty,
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

    return newDoctorRecord;
  } catch (error) {
    console.error("An error occurred while creating a new doctor record:", error);
    throw new Error("Failed to register doctor.");
  }
};

export async function getDoctor(doctorId: string) {
  return await prisma.doctorDetails.findUnique({
    where: { userId: doctorId },
  });
}

export async function getAllDoctors() {
  const doctors = await prisma.doctorDetails.findMany();
  return doctors || [];
}
