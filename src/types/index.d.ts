import { Role, Status, PatientDetails, DoctorDetails, Appointment } from "@prisma/client";

declare type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";

declare interface CreateUserParams {
  name: string | null;
  email: string;
  phone: string | null;
  password: string;
  role: "doctor" | "patient" | "admin";
}

declare type CreateAppointmentParams = {
  doctorId: string;
  patientId: string;
  reason?: string; // Use optional instead of undefined
  schedule: Date;
  note?: string; // Use optional instead of undefined
};
declare type UpdateAppointmentParams = {
  appointmentId: string;
  timeZone: string; // Defina o tipo do timeZone se for específico
  appointment: {
    doctorId: string; // Se necessário
    schedule: Date;
    status: Status; // Use o tipo Status
    cancellationReason?: string; // Use optional
  };
  type: "schedule" | "cancel"; // Use tipos literais
};

declare interface RegisterPatientParams extends Patient {
  identificationDocument?: FormData;
  imageFile?: FormData;
}

export interface RegisterDoctorParams extends Doctor {
  identificationDocument?: FormData;
  imageFile?: FormData;
}

export interface User {
  name?: string | null;
  id: string;
  phone?: string | null;
  email?: string | null;
  role: $Enums.Role;
  image?: string | null;
  emailVerified: Date | null;
  password?: string | null;
  isDone: boolean;
}
export interface Doctor extends User {
  role: Role;
  doctorDetails: DoctorDetails;
}

export interface Patient extends User {
  role: Role;
  patientDetails: PatientDetails;
}

export interface CompleteAppointment extends Appointment {
  patient: PatientDetails;
  doctor: DoctorDetails;
}

export interface AppointmentCount {
  documents: CompleteAppointment[];
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  finalizedCount: number;
  totalCount: number;
}

export interface Plan {
  id: string;
  name: string;
  amount: number;
  interval: string;
  currency: string;
  features: string[];
  recurring: any;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface Area {
  name: string;
  image: string;
  icon: React.ElementType;
}
