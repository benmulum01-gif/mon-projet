/**
 * Subscription plans. Amounts are PLACEHOLDERS: set them to your real prices
 * (and the matching Stripe Price IDs in .env) before going live.
 * Display currency is independent of the visitor's language.
 */
export const PRICING_CURRENCY = "EUR";

export const plans = [
  { id: "starter", monthlyCents: 4900, priceEnv: "STRIPE_PRICE_STARTER", highlighted: false },
  { id: "growth", monthlyCents: 14900, priceEnv: "STRIPE_PRICE_GROWTH", highlighted: true },
] as const;

export type PlanId = (typeof plans)[number]["id"];

export function isPlanId(value: unknown): value is PlanId {
  return plans.some((plan) => plan.id === value);
}
