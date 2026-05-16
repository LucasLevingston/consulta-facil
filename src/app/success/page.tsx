import HeaderSection from "@/components/HeaderSection";
import { PlanCard } from "@/components/plans/PlanCard";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import stripe from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";

export default async function SuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string
  );

  const subscription = await stripe.subscriptions.retrieve(
    session?.subscription?.toString()!
  );

  const subscriptionPlanId = subscription.items.data[0]?.price.id;

  const plan = plans.find(
    (plan) =>
      plan.priceIdMonthly === subscriptionPlanId ||
      plan.priceIdYearly === subscriptionPlanId
  );

  return (
    <main className="flex size-full flex-col justify-center items-center gap-4 p-12">
      <HeaderSection label="Pagamento finalizado" />
      <h1 className="mb-3 scroll-m-20 text-5xl font-semibold tracking-tight transition-colors first:mt-0">
        Compra efetuada com sucesso!
      </h1>
      <Image src="/assets/gifs/success.gif" height={300} width={280} alt="sucesso" />
      <div className="flex flex-col justify-center items-center gap-y-2">
        {plan && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-xl">Você assinou o plano {plan.title}</h1>
            <PlanCard {...plan} />
          </div>
        )}
        <div className="flex gap-2 font-bold">
          <Link href="/dashboard" className="mt-4">
            <Button className="font-semibold">Gerar comprovante</Button>
          </Link>
          <Link href="/dashboard" className="mt-4">
            <Button className="font-semibold">Voltar para a página inicial</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
