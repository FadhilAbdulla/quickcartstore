export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { SettingsManager } from "@/components/admin/settings-manager"

export default async function AdminSettingsPage() {
  const settings = await db.settings.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Site-wide configuration</p>
      </div>
      <SettingsManager
        initialTheme={map.theme || "dark"}
        initialVatRate={parseFloat(map.vatRate ?? "5")}
        initialProcessingRate={parseFloat(map.processingRate ?? "0")}
      />
    </div>
  )
}
