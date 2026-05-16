import Image from "next/image";

import { auth } from "@/auth";
import AppointmentsDashboard from "@/components/AppointmentDashboard";
import HeaderSection from "@/components/HeaderSection";
import Loading from "@/components/loading";
import { ExtendUser } from "@/next-auth";

const AppointmentsPage = async () => {
  const session = await auth();

  return (
    <div className="flex">
      <section className="remove-scrollbar container">
        <HeaderSection
          label={
            <>
              <span className="rounded-full bg-red-700 p-2 text-white">Admin</span>{" "}
              <span>Consultas</span>
            </>
          }
        />
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <section className="w-full space-y-4">
            <h1 className="header">Olá, {session?.user.name} 👋</h1>
            <p className="">Aqui estão todas as consultas agendadas.</p>
          </section>
          {session?.user ? (
            <AppointmentsDashboard user={session?.user as ExtendUser} role="admin" />
          ) : (
            <Loading />
          )}
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="paciente"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default AppointmentsPage;
