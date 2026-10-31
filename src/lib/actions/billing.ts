"use server";

import { redirect } from "next/navigation";
import { plans, isPlanId } from "@/config/plans";
import { requireAppContext } from "@/lib/app-context";
import { env } from "@/lib/env";
import type { FormState } from "@/lib/forms";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function startCheckout(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (ctx.role !== "owner" && ctx.role !== "admin") return { error: "forbidden", nonce: Date.now() };
  const planId = formData.get("plan");
  if (!isPlanId(planId)) return { error: "generic", nonce: Date.now() };
  const plan = plans.find((p) => p.id === planId)!;
  const price = process.env[plan.priceEnv];
  if (!isStripeConfigured() || !price) return { error: "stripeNotConfigured", nonce: Date.now() };

  const supabase = await createClient();
  const { data: existing } = await supabase.from("subscriptions").select("stripe_customer_id").eq("workspace_id", ctx.workspace.id).maybeSingle();
  const base = `${env.siteUrl}/${ctx.locale}/app/billing`;
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    // Stripe's hosted page is shown in the user's interface language.
    locale: ctx.locale,
    customer: existing?.stripe_customer_id ?? undefined,
    customer_email: existing?.stripe_customer_id ? undefined : ctx.email,
    client_reference_id: ctx.workspace.id,
    subscription_data: { metadata: { workspace_id: ctx.workspace.id, plan: plan.id } },
    metadata: { workspace_id: ctx.workspace.id, plan: plan.id },
    success_url: `${base}?checkout=success`,
    cancel_url: `${base}?checkout=canceled`,
  });
  if (!session.url) return { error: "generic", nonce: Date.now() };
  redirect(session.url);
}

export async function openBillingPortal(): Promise<FormState> {
  const ctx = await requireAppContext();
  if (ctx.role !== "owner" && ctx.role !== "admin") return { error: "forbidden", nonce: Date.now() };
  if (!isStripeConfigured()) return { error: "stripeNotConfigured", nonce: Date.now() };
  const supabase = await createClient();
  const { data } = await supabase.from("subscriptions").select("stripe_customer_id").eq("workspace_id", ctx.workspace.id).maybeSingle();
  if (!data?.stripe_customer_id) return { error: "generic", nonce: Date.now() };
  const session = await getStripe().billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    locale: ctx.locale,
    return_url: `${env.siteUrl}/${ctx.locale}/app/billing`,
  });
  redirect(session.url);
}
