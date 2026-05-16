import { Doctor } from "@/types";

export const getDefaultValues = (user: Doctor) => {
  const doctorDetails = user.doctorDetails || {};

  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    imageProfile: undefined,
    gender: doctorDetails.gender || "male",
    birthDate: doctorDetails.birthDate || new Date(Date.now()),
    cpf: doctorDetails.cpf || "",
    address: doctorDetails.address || "",
    specialty: doctorDetails.specialty || "",
    licenseNumber: doctorDetails.licenseNumber || "",
    identificationDocumentType: doctorDetails.identificationDocumentType || "",
    identificationDocument: undefined,
    privacyConsent: doctorDetails.privacyConsent || false,
  };
};
