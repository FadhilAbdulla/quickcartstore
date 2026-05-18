import { db } from "@/lib/db"

export async function getCurrency(): Promise<string> {
  const setting = await db.settings.findUnique({ where: { key: "currency" } })
  return setting?.value ?? "AED"
}
