import { Gender } from "@prisma/client";

import { Patient } from "@/types";

export const PatientDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationDocumentType: "Birth Certificate",
  cpf: "",
  identificationDocument: undefined,
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const getDefaultValues = (user: Patient) => {
  const patientDetails = user.patientDetails || {};
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    birthDate: patientDetails.birthDate || new Date(Date.now()),
    gender: patientDetails.gender || "male",
    address: patientDetails.address || "",
    occupation: patientDetails.occupation || "",
    emergencyContactName: patientDetails.emergencyContactName || "",
    emergencyContactNumber: patientDetails.emergencyContactNumber || "",
    allergies: patientDetails.allergies || "",
    currentMedication: patientDetails.currentMedication || "",
    familyMedicalHistory: patientDetails.familyMedicalHistory || "",
    pastMedicalHistory: patientDetails.pastMedicalHistory || "",
    identificationDocumentType:
      patientDetails.identificationDocumentType || "Birth Certificate",
    cpf: patientDetails.cpf || "",
    identificationDocument: undefined,
    imageProfile: undefined,
    treatmentConsent: patientDetails.treatmentConsent || false,
    disclosureConsent: patientDetails.disclosureConsent || false,
    privacyConsent: patientDetails.privacyConsent || false,
  };
};
