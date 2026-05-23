import type React from "react";

declare type SearchParamProps = {
	searchParams: { [key: string]: string | string[] | undefined };
};

// Enums alinhados ao backend
declare type UserRole = "PATIENT" | "PROFESSIONAL" | "ADMIN";
declare type Gender = "MALE" | "FEMALE" | "OTHER";
declare type AppointmentStatus =
	| "PENDING"
	| "CONFIRMED"
	| "CANCELED"
	| "COMPLETED";

// Auth
declare type AuthUser = {
	userId: string;
	email: string;
	role: UserRole;
};

// User
declare type UserResponse = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	phone?: string | null;
	cpf?: string | null;
	birthDate?: string | null;
	gender?: Gender | null;
	imageUrl?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

declare type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	cpf?: string;
	phone?: string;
	birthDate?: string;
	gender?: Gender;
};

declare type LoginInput = {
	email: string;
	password: string;
};

declare type LoginResponse = {
	token: string;
	type: string;
	expiresIn: number;
	userId: string;
	email: string;
	role: UserRole;
};

// Address
declare type AddressInput = {
	zipCode: string;
	street: string;
	number: string;
	district?: string;
	city: string;
	state: string;
	country?: string;
};

// Professional
declare type ProfessionalResponse = {
	id: string;
	userId: string;
	name?: string | null;
	email?: string | null;
	specialty: string;
	licenseNumber?: string | null;
	phone?: string | null;
};

declare type CreateProfessionalInput = {
	specialty: string;
	licenseNumber: string;
};

// Patient
declare type PatientProfile = {
	id?: string;
	userId?: string;
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	cpf?: string | null;
	birthDate?: string | null;
	gender?: Gender | null;
	occupation?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

declare type UpdatePatientInput = {
	occupation?: string;
};

declare type MedicalRecord = {
	id?: string;
	allergies?: string | null;
	currentMedication?: string | null;
	familyMedicalHistory?: string | null;
	pastMedicalHistory?: string | null;
	privacyConsent?: boolean | null;
	treatmentConsent?: boolean | null;
	disclosureConsent?: boolean | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

declare type UpdateMedicalRecordInput = {
	allergies?: string;
	currentMedication?: string;
	familyMedicalHistory?: string;
	pastMedicalHistory?: string;
	privacyConsent?: boolean;
	treatmentConsent?: boolean;
	disclosureConsent?: boolean;
};

// Appointment
declare type AppointmentResponse = {
	id: string;
	patientName?: string | null;
	patientId: string;
	professionalName?: string | null;
	professionalId: string;
	specialty?: string | null;
	scheduledAt: string;
	reason?: string | null;
	notes?: string | null;
	status: AppointmentStatus;
	cancellationReason?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

declare type CreateAppointmentInput = {
	professionalId: string;
	scheduledAt: string;
	reason?: string;
	notes?: string;
};

declare type CancelAppointmentInput = {
	cancellationReason: string;
};

// Pagination
declare type ApiPage<T> = {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first?: boolean;
	last?: boolean;
};

// UI
export interface NavItem {
	title: string;
	url: string;
	disabled?: boolean;
	external?: boolean;
	icon?: string;
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
