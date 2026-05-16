"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="items-center justify-center text-center">
      <h2 className="font-heading my-2 text-2xl font-bold">Página não encontrada</h2>
      <p>Desculpe, essa página não existe</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="secondary" size="lg">
          Voltar
        </Button>
        <Button onClick={() => router.push("/dashboard")} variant="outline" size="lg">
          Ir para página inicial
        </Button>
      </div>
    </div>
  );
}
