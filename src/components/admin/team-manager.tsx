"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Users, Check, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Member {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: Date
}

export function TeamManager({ initialTeam, currentUserId }: { initialTeam: Member[]; currentUserId: string }) {
  const [team, setTeam] = useState(initialTeam)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return toast.error("All fields are required")
    }
    setLoading(true)
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setTeam((prev) => [...prev, data])
      setForm({ name: "", email: "", password: "" })
      setAdding(false)
      toast.success("Team member added")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (member: Member) => {
    if (!confirm(`Remove admin access for ${member.name || member.email}? They will become a regular customer.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setTeam((prev) => prev.filter((m) => m.id !== member.id))
      toast.success("Admin access removed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setAdding(true); setForm({ name: "", email: "", password: "" }) }} size="sm">
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {adding && (
        <div className="bg-[#111111] border border-blue-600/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-5">Add Admin Team Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@quickcart.ae" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-600">If the email already has an account, they will be promoted to admin.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={loading} size="sm"><Check className="h-4 w-4" />Add Member</Button>
            <Button variant="outline" onClick={() => setAdding(false)} size="sm"><X className="h-4 w-4" />Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
              <th className="text-left text-gray-500 font-medium px-5 py-3">Member</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Phone</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Joined</th>
              <th className="text-right text-gray-500 font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {team.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <Users className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No team members</p>
                </td>
              </tr>
            ) : team.map((member) => {
              const isCurrentUser = member.id === currentUserId
              return (
                <tr key={member.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-semibold shrink-0">
                        {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm">{member.name || "—"}</p>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600/20 text-blue-400 font-medium">You</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{member.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(member.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {isCurrentUser ? (
                      <span className="text-gray-600 text-xs">—</span>
                    ) : (
                      <button
                        onClick={() => handleRemove(member)}
                        disabled={loading}
                        className="text-gray-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
