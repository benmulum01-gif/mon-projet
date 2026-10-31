import type Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { getStripe, isStripeConfigured, syncSubscription } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

const HANDLED = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!isStripeConfigured() || !secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    // The raw body is required for signature verification.
    event = await getStripe().webhooks.constructEventAsync(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }
  if (!HANDLED.has(event.type)) return NextResponse.json({ received: true });

  const stripe = getStripe();
  const admin = createAdminClient();
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.mode === "subscription" && typeof session.subscription === "string") {
      await syncSubscription(admin, await stripe.subscriptions.retrieve(session.subscription));
    }
  } else if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await syncSubscription(admin, event.data.object);
  }
  return NextResponse.json({ received: true });
}
