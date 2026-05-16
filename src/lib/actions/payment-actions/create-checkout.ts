"use server";
import stripe from "@/lib/stripe";

export async function createCheckout({
  testeId,
  assinatura,
}: {
  testeId: string;
  assinatura: boolean;
}) {
  const price = assinatura
    ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID
    : process.env.STRIPE_PRICE_ID;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: assinatura ? "subscription" : "payment",
      payment_method_types: assinatura ? ["card"] : ["card", "boleto"],
      success_url: `${process.env.NEXT_PUBLIC_URL}/sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
      metadata: {
        testeId,
      },
    });

    return { sessionId: session.id };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
