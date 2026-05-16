import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: NextRequest) {
  const { userId, email, priceId, subscription } = await req.json();

  const successUrl = `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/cancel`;

  const commonOptions: Stripe.Checkout.SessionCreateParams = {
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId, email },
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  try {
    let sessionOptions: Stripe.Checkout.SessionCreateParams;

    if (subscription) {
      sessionOptions = {
        ...commonOptions,
        mode: "subscription",
        payment_method_types: ["card"],
        allow_promotion_codes: true,
      };
    } else {
      sessionOptions = {
        ...commonOptions,
        mode: "payment",
        payment_method_types: ["card"],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
