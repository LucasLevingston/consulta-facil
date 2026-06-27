import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";

export type ContactItem = EmergencyContactInput & { id?: string };
