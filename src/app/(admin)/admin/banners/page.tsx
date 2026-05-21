export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { BannersManager } from "@/components/admin/banners-manager"

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "#072654" }}>Hero Banners</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the scrollable banners displayed at the top of the homepage. Active banners rotate automatically every 5 seconds.
        </p>
      </div>
      <BannersManager initialBanners={banners} />
    </div>
  )
}
