import { redirect } from "next/navigation";

import { auth } from "@/auth";
import DoctorDetailsForm from "@/components/forms/DoctorDetails/DoctorDetailsForm";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.isDone) {
    redirect("/auth/completar-cadastro");
  }

  return session?.user?.role === "doctor" ? (
    <DoctorDetailsForm user={session.user} type="edit" />
  ) : (
    <PatientDetailsForm user={session.user} type="edit" />
  );
}
