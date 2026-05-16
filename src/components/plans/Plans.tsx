"use client";
import { plans } from "@/constants";
import React, { useEffect, useState } from "react";
import { PlanCard } from "./PlanCard";
import { PlansHeader } from "./PlansHeader";
import { PlansSwitch } from "./PlansSwitch";
import { toast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import axios from "axios";
import MyPlan from "./MyPlan";

export default function Plans() {
  const { data } = useSession();
  const user = data?.user;
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const togglePlansPeriod = (value: string) => setIsYearly(parseInt(value) === 1);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    try {
      const { data } = await axios.post(`/api/stripe/create-checkout-session`, {
        userId: user?.id,
        email: user?.email,
        priceId,
        subscription,
      });

      if (data.sessionId) {
        const stripe = await stripePromise;

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        return response;
      } else {
        console.error("Failed to create checkout session");
        toast({ title: "Failed to create checkout session" });
        return;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({ title: "Error during checkout" });
      return;
    }
  };
  return (
    <>
      <PlansHeader title="Planos" subtitle="Assine para começar a receber consultas!" />
      <PlansSwitch onSwitch={togglePlansPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 ">
        {plans.map((plan) => {
          return (
            <PlanCard
              key={plan.title}
              user={user!}
              handleCheckout={handleCheckout}
              {...plan}
              isYearly={isYearly}
            />
          );
        })}
      </section>
      <MyPlan />
    </>
  );
}
