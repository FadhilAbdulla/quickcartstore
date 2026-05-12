import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const team = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(team)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name, email, password } = await req.json()
  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }
  const existing = await db.user.findUnique({ where: { email: email.trim() } })
  if (existing) {
    if (existing.role === "ADMIN") return NextResponse.json({ error: "User is already an admin" }, { status: 409 })
    const updated = await db.user.update({
      where: { id: existing.id },
      data: { role: "ADMIN", name: name.trim() },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    return NextResponse.json(updated, { status: 201 })
  }
  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { name: name.trim(), email: email.trim(), password: hashed, role: "ADMIN" },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return NextResponse.json(user, { status: 201 })
}
