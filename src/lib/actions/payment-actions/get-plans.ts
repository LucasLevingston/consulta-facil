"use server";
import stripe from "@/lib/stripe";

export async function getPlans() {
  try {
    const plans = await stripe.plans.list({
      active: true,
    });
    console.log(plans);
    return plans;
  } catch (error) {
    console.error("Erro ao buscar planos do Stripe:", error);
    throw new Error("Falha ao buscar planos. Por favor, tente novamente mais tarde.");
  }
}
