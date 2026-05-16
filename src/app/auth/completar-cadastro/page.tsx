import Image from "next/image";

import { auth } from "@/auth";
import DoctorDetailsForm from "@/components/forms/DoctorDetails/DoctorDetailsForm";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import HeaderSection from "@/components/HeaderSection";
import Loading from "@/components/loading";
import { ExtendUser } from "@/next-auth";

const Register = async () => {
  const session = await auth();

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <HeaderSection label="Completar Cadastro" />
          <section className="space-y-4">
            <h1 className="header">Bem-vindo 👋</h1>
            <p className="text-dark-700">Conte-nos mais sobre você.</p>
          </section>
          {session?.user ? (
            session.user.role === "doctor" ? (
              <DoctorDetailsForm user={session.user as ExtendUser} type="create" />
            ) : (
              <PatientDetailsForm user={session.user as ExtendUser} type="create" />
            )
          ) : (
            <Loading />
          )}
          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
