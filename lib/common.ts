export function normalizePhoneNumber(phone: string) {
  return phone.replace(/\s/g, "");
}

export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function getApiError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({}));
  return typeof data.error === "string" ? data.error : fallback;
}
