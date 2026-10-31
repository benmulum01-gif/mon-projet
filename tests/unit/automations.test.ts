import { describe, expect, it } from "vitest";
import { chooseVariant, renderTemplate } from "@/lib/automations/render";
import { defaultAiLocale } from "@/lib/ai/language";

const variants = [
  { locale: "en", subject: null, body: "Hi {{first_name}}, thanks for contacting {{business_name}}." },
  { locale: "fr", subject: null, body: "Bonjour {{first_name}}, merci d'avoir contacté {{business_name}}." },
];

describe("chooseVariant", () => {
  it("uses the conversation language first, then the lead's", () => {
    expect(chooseVariant(variants, { conversationLocale: "fr", leadLocale: "en", workspaceDefault: "en" })).toMatchObject({ ok: true, locale: "fr", reason: "recipient" });
    expect(chooseVariant(variants, { leadLocale: "fr", workspaceDefault: "en" })).toMatchObject({ ok: true, locale: "fr" });
  });
  it("falls back to the workspace default, never to the interface language", () => {
    expect(chooseVariant(variants, { leadLocale: null, workspaceDefault: "en" })).toMatchObject({ ok: true, locale: "en", reason: "workspace_default" });
  });
  it("reports a missing translation instead of sending another language", () => {
    expect(chooseVariant([variants[1]], { leadLocale: "en", workspaceDefault: "en" })).toEqual({ ok: false, missing: "en" });
  });
});

describe("renderTemplate", () => {
  it("fills placeholders and formats dates in the message language and business time zone", () => {
    const out = renderTemplate("Rendez-vous le {{appointment_time}} avec {{full_name}} {{unknown}}", "fr", {
      fullName: "Jean Dupont",
      businessName: "Acme",
      appointmentAt: "2026-10-18T13:30:00Z",
      timeZone: "Europe/Paris",
    });
    expect(out).toBe("Rendez-vous le 18 oct. 2026, 15:30 avec Jean Dupont {{unknown}}");
  });
});

describe("defaultAiLocale", () => {
  const base = { workspaceDefaultComm: "en", uiLocale: "fr" as const };
  it("writes to prospects in their language, even when the user works in another", () => {
    expect(defaultAiLocale({ ...base, purpose: "recipient", leadLocale: "en" })).toBe("en");
    expect(defaultAiLocale({ ...base, purpose: "recipient", conversationLocale: "fr", leadLocale: "en" })).toBe("fr");
  });
  it("uses the workspace default when the recipient's language is unknown", () => {
    expect(defaultAiLocale({ ...base, purpose: "recipient" })).toBe("en");
  });
  it("uses the internal AI setting, or the reader's interface language, for internal content", () => {
    expect(defaultAiLocale({ ...base, purpose: "internal" })).toBe("fr");
    expect(defaultAiLocale({ ...base, purpose: "internal", workspaceInternalAi: "en" })).toBe("en");
  });
});
