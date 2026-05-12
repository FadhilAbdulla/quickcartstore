import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, phone } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const user = await db.user.update({
      where: { id: (session.user as any).id },
      data: { name: name.trim(), phone: phone?.trim() || null },
      select: { id: true, name: true, email: true, phone: true },
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
