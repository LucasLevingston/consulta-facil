"use client";

import { createCheckout } from "@/lib/actions/payment-actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "./ui/button";

export default function BuyButton() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  async function handleClick(testeId: string, assinatura: boolean) {
    try {
      setIsCreatingCheckout(true);

      const result = createCheckout({ assinatura, testeId });

      const stripeClient = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
      );

      if (!stripeClient) throw new Error("Stripe failed to initialize.");

      const { sessionId } = await result;
      await stripeClient.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  return (
    <div className="flex gap-5">
      <Button
        disabled={isCreatingCheckout}
        className="border rounded-md px-4 py-2 disabled:opacity-50"
        onClick={() => handleClick("123", false)}
      >
        Comprar
      </Button>
      <Button
        disabled={isCreatingCheckout}
        className="border rounded-md px-4 py-2 disabled:opacity-50"
        onClick={() => handleClick("123", true)}
      >
        Assinar
      </Button>
    </div>
  );
}
