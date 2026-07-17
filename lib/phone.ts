/** Normalize a phone string to WhatsApp international digits (no +). */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // Pakistan local mobile: 03XXXXXXXXX → 923XXXXXXXXX
  if (digits.startsWith("03") && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  // Already country-coded without leading 0
  if (digits.startsWith("92") && digits.length >= 12) {
    return digits;
  }
  // +92… already stripped to digits
  return digits;
}

export function whatsAppChatUrl(
  phone: string,
  message = "Hi Shabbar, I found your portfolio and would like to connect.",
): string {
  const n = toWhatsAppNumber(phone);
  if (!n) return "#";
  const text = encodeURIComponent(message);
  return `https://wa.me/${n}?text=${text}`;
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

/** Display form for PK numbers. */
export function formatDisplayPhone(phone: string): string {
  const wa = toWhatsAppNumber(phone);
  if (wa.startsWith("92") && wa.length === 12) {
    return `+92 ${wa.slice(2, 5)} ${wa.slice(5, 8)}${wa.slice(8)}`;
  }
  return phone.trim();
}
