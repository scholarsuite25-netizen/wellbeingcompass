// Central contact & sharing configuration for Wellbeing Compass
export const CONTACT_PHONE_DISPLAY = "+234 814 662 0168";
export const CONTACT_PHONE_TEL = "tel:+2348146620168";
export const CONTACT_WHATSAPP_URL =
  "https://wa.me/2348146620168";

// Prefill a WhatsApp message
export function waLink(message?: string): string {
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/2348146620168${text ? `?text=${text}` : ""}`;
}

export const SITE_NAME = "Wellbeing Compass";
