"use server";

import { auth } from "@/auth";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sessionAuth = await auth();

    if (!sessionAuth || !sessionAuth.user || !sessionAuth.user.id) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sessionAuth.user.id as string,
      return_url: process.env.NEXT_AUTH_URL,
    });
    console.log(session);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
