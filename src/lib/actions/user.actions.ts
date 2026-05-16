"use server";

import { User } from "@prisma/client";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExtendUser } from "@/next-auth";
import { CreateUserParams } from "@/types";

import { comparePassword, hashPassword } from "../utils";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      doctorDetails: true,
      patientDetails: true,
    },
  });
};

export async function createUser(user: CreateUserParams) {
  const hashedPassword = await hashPassword(user.password);

  const doesEmailExist = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (doesEmailExist) {
    throw new Error("Email already exists");
  }

  const createAccount = await prisma.user.create({
    data: { ...user, password: hashedPassword },
  });
  return createAccount;
}

export const registerUser = async (formData: CreateUserParams) => {
  const hashedPassword = await hashPassword(formData.password);

  try {
    const newUser = await prisma.user.create({
      data: {
        role: formData.role,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithCreds = async (data: { email: string; password: string }) => {
  try {
    const existingUser = await getUserByEmail(data.email);
    if (!existingUser) {
      throw new Error("User not found.");
    }
    if (!existingUser.password) throw new Error("Password not defined!");

    const passwordMatch = await comparePassword(data.password, existingUser.password);

    if (!passwordMatch) throw new Error("Invalid credentials!");

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    const user = await getUserByEmail(data.email);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  await signIn("google");
};

export const SignOut = async () => {
  return await signOut({ redirectTo: "/" });
};

export const getUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      doctorDetails: true,
      patientDetails: true,
    },
  });
};

export const updateUser = async (user: ExtendUser): Promise<User | null> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        doctorDetails: user.doctorDetails.specialty
          ? {
              update: {
                specialty: user.doctorDetails.specialty,
                phone: user.phone,
                email: user.email,
                licenseNumber: user.doctorDetails.licenseNumber,
                identificationDocumentId: user.doctorDetails.identificationDocumentId,
                identificationDocumentUrl: user.doctorDetails.identificationDocumentUrl,
              },
            }
          : undefined, // Evita a atualização se não for um médico
        patientDetails: user.patientDetails
          ? {
              update: {
                phone: user.patientDetails.phone,
                name: user.patientDetails.name,
                email: user.patientDetails.email,
                privacyConsent: user.patientDetails.privacyConsent,
                gender: user.patientDetails.gender,
                birthDate: user.patientDetails.birthDate,
                address: user.patientDetails.address,
                occupation: user.patientDetails.occupation,
                emergencyContactName: user.patientDetails.emergencyContactName,
                emergencyContactNumber: user.patientDetails.emergencyContactNumber,
                allergies: user.patientDetails.allergies,
                currentMedication: user.patientDetails.currentMedication,
                familyMedicalHistory: user.patientDetails.familyMedicalHistory,
                pastMedicalHistory: user.patientDetails.pastMedicalHistory,
                identificationDocumentId: user.patientDetails.identificationDocumentId,
                identificationDocumentUrl: user.patientDetails.identificationDocumentUrl,
              },
            }
          : undefined, // Evita a atualização se não for um paciente
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
