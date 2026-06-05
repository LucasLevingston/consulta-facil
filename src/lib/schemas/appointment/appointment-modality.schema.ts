import { z } from "zod";

export const appointmentModalitySchema = z.enum(["IN_PERSON", "ONLINE"]);

export type AppointmentModality = z.infer<typeof appointmentModalitySchema>;
