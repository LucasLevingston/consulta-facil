"use client";

import { useRouter } from "next/navigation";

import { ContactSection } from "@/components/ContactSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Button } from "@/components/ui/button";
import PlansSection from "@/components/plans/PlansSection";

export default function Home() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/agendar-consulta");
  };

  return (
    <div className="flex-1">
      <section className="w-full bg-mainColor py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl  font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Agende suas consultas com facilidade
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-200 md:text-xl">
                ConsultaFácil torna o agendamento de consultas médicas simples e rápido.
                Escolha seu médico, data e horário em poucos cliques.
              </p>
            </div>
            <div className="space-x-4">
              <Button
                className=" border-white font-bold"
                variant="outline"
                onClick={handleRedirect}
              >
                Agendar Consulta
              </Button>
              <Button>Ver Meus Agendamentos</Button>
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />

      <PlansSection />

      <ContactSection />
    </div>
  );
}
