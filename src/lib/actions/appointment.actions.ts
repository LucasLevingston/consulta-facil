"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  AppointmentCount,
  CreateAppointmentParams,
  UpdateAppointmentParams,
} from "@/types";

import { countAppointments, parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  return await prisma.appointment.create({
    data: appointment,
  });
};

export const getAppointments = async () => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: { patient: true, doctor: true },
    });

    const appointmentCount: AppointmentCount = countAppointments(appointments);
    return appointmentCount;
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
    throw new Error("Failed to create appointment");
  }
};

//  SEND SMS NOTIFICATION
// export const sendSMSNotification = async (userId: string, content: string) => {
//   try {
//     const message = await messaging.createSms(ID.unique(), content, [], [userId]);
//     return parseStringify(message);
//   } catch (error) {
//     console.error("An error occurred while sending SMS:", error);
//   }
// };

export const updateAppointment = async ({
  appointmentId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: appointment,
    });

    if (!updatedAppointment) throw new Error("Appointment not found");

    // const smsMessage = `Greetings from ConsultaFácil. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason: ${appointment.cancellationReason}.`}`;
    // await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while updating the appointment:", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  return await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
};

export const getAppointmentsByDoctorId = async (doctorId: string) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: { doctor: true, patient: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    const appointmentCount: AppointmentCount = countAppointments(appointments);
    return appointmentCount;
  } catch (error) {
    throw new Error("Failed to get appointments");
  }
};

export const getAppointmentsByPatientId = async (patientId: string) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: { patient: true, doctor: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    const appointmentCount: AppointmentCount = countAppointments(appointments);
    return appointmentCount;
  } catch (error) {
    throw new Error("Failed to get appointments");
  }
};
