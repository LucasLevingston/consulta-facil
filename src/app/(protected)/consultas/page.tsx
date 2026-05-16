import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AppointmentsDashboard from "@/components/AppointmentDashboard";
import HeaderSection from "@/components/HeaderSection";
import Loading from "@/components/loading";
import { ExtendUser } from "@/next-auth";

const AppointmentsPage = async () => {
  const session = await auth();
  if (!session?.user?.isDone) {
    redirect("/auth/completar-cadastro");
  }
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <HeaderSection label={`Consultas`} />
        <div className="sub-container max-w-[860px] flex-1 flex-col gap-5">
          <section className="w-full space-y-4">
            <h1 className="header">Olá, {session?.user.name} 👋</h1>
            <p>Aqui estão suas consultas agendadas.</p>
          </section>
          {session?.user ? (
            <AppointmentsDashboard
              user={session?.user as ExtendUser}
              role={session.user.role}
            />
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
