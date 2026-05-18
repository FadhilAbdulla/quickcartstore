import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_LOCALES: Record<string, string> = {
  AED: "en-AE",
  USD: "en-US",
  EUR: "en-GB",
  GBP: "en-GB",
  SAR: "en-SA",
  KWD: "en-KW",
  QAR: "en-QA",
  BHD: "en-BH",
  OMR: "en-OM",
}

export function formatPrice(price: number | string, currency = "AED") {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency] ?? "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(Number(price))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateOrderNumber() {
  return `QC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}
