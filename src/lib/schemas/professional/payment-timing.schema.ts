import { z } from "zod";

export const paymentTimingSchema = z.enum(["AT_SCHEDULING", "AT_CONSULTATION"]);

export type PaymentTiming = z.infer<typeof paymentTimingSchema>;
