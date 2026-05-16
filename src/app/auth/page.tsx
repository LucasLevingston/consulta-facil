"use client";

import Image from "next/image";

import { UserForm } from "@/components/forms/UserForm";
import HeaderSection from "@/components/HeaderSection";

const Home = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <HeaderSection label={`Autenticação`} />
        <div className="sub-container max-w-[496px]">
          <UserForm />
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
