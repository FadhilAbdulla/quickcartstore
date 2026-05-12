export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { TeamManager } from "@/components/admin/team-manager"

export default async function AdminTeamPage() {
  const session = await auth()
  const currentUserId = session!.user.id

  const team = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Team Members</h1>
        <p className="text-gray-500 text-sm mt-1">{team.length} admin {team.length === 1 ? "member" : "members"}</p>
      </div>
      <TeamManager initialTeam={team} currentUserId={currentUserId} />
    </div>
  )
}
