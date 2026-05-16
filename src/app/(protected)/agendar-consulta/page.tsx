import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppointmentForm } from "@/components/forms/Appointments/AppointmentForm";
import HeaderSection from "@/components/HeaderSection";
import { getAllDoctors } from "@/lib/actions/doctor.actions";
import { ExtendUser } from "@/next-auth";


const Appointment = async () => {
  const session = await auth();
  const doctors = await getAllDoctors();

  if (!session?.user?.isDone) {
    redirect("/auth/completar-cadastro");
  }
  if (session?.user?.role === "doctor") {
    redirect("/");
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <HeaderSection label={"Agendar consulta"} />
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <AppointmentForm
            type="create"
            doctors={doctors}
            user={session?.user as ExtendUser}
          />
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
