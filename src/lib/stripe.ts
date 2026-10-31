import "server-only";
import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

let stripe: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

/**
 * Mirrors a Stripe subscription into public.subscriptions. The workspace is
 * identified by the metadata we set when creating the Checkout Session.
 */
export async function syncSubscription(admin: SupabaseClient<Database>, subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id;
  if (!workspaceId) return;
  const item = subscription.items.data[0];
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  await admin.from("subscriptions").upsert({
    workspace_id: workspaceId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    plan: subscription.metadata?.plan ?? null,
    status: subscription.status,
    current_period_end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
}
