"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash2, ToggleLeft, ToggleRight, Ticket, X, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/context/currency-context"

interface PromoCode {
  id: string
  code: string
  discountType: string
  discountValue: number
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  expiresAt: Date | null
  isActive: boolean
  createdAt: Date
}

interface PromoCodesManagerProps {
  initialCodes: PromoCode[]
}

const emptyForm = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
}

export function PromoCodesManager({ initialCodes }: PromoCodesManagerProps) {
  const currency = useCurrency()
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const resetForm = () => { setForm(emptyForm); setShowForm(false) }

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discountValue) {
      toast.error("Code and discount value are required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/promocodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to create"); return }
      setCodes((prev) => [{ ...data, discountValue: Number(data.discountValue), minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null }, ...prev])
      toast.success("Promo code created")
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (code: PromoCode) => {
    setTogglingId(code.id)
    try {
      const res = await fetch(`/api/admin/promocodes/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !code.isActive }),
      })
      if (!res.ok) { toast.error("Failed to update"); return }
      setCodes((prev) => prev.map((c) => c.id === code.id ? { ...c, isActive: !c.isActive } : c))
      toast.success(code.isActive ? "Code deactivated" : "Code activated")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/promocodes/${id}`, { method: "DELETE" })
      if (!res.ok) { toast.error("Failed to delete"); return }
      setCodes((prev) => prev.filter((c) => c.id !== id))
      toast.success("Promo code deleted")
    } finally {
      setDeletingId(null)
    }
  }

  const formatExpiry = (date: Date | null) => {
    if (!date) return "No expiry"
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  const isExpired = (date: Date | null) => date ? new Date(date) < new Date() : false

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />New Promo Code
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Create Promo Code</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="font-mono uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount Type *</Label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (AED)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input
                type="number"
                min="0"
                max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 100"}
              />
            </div>
            <div className="space-y-2">
              <Label>Min Order Amount (AED)</Label>
              <Input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                placeholder="e.g. 500 (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Uses</Label>
              <Input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Unlimited if empty"
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Code"}
            </Button>
          </div>
        </div>
      )}

      {/* Codes list */}
      {codes.length === 0 ? (
        <div className="text-center py-16 bg-[#111111] border border-[#1e1e1e] rounded-xl">
          <Ticket className="h-10 w-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">No promo codes yet</p>
          <p className="text-gray-600 text-sm mt-1">Create your first promo code to get started</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Discount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Usage</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {codes.map((code) => {
                const expired = isExpired(code.expiresAt)
                return (
                  <tr key={code.id} className="hover:bg-[#0f0f0f] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-semibold text-white text-sm">{code.code}</span>
                      {code.minOrderAmount && (
                        <p className="text-gray-600 text-xs mt-0.5">Min {formatPrice(code.minOrderAmount, currency)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-white text-sm">
                        {code.discountType === "PERCENTAGE"
                          ? `${code.discountValue}% off`
                          : `${formatPrice(code.discountValue, currency)} off`}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-gray-400 text-sm">
                        {code.usedCount} / {code.maxUses ?? "∞"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-sm ${expired ? "text-red-400" : "text-gray-400"}`}>
                        {formatExpiry(code.expiresAt)}
                        {expired && <span className="ml-1 text-xs">(expired)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(code)}
                        disabled={togglingId === code.id}
                        className="flex items-center gap-1.5 transition-colors"
                      >
                        {togglingId === code.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        ) : code.isActive && !expired ? (
                          <>
                            <ToggleRight className="h-5 w-5 text-green-500" />
                            <span className="text-green-400 text-xs">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-500 text-xs">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(code.id)}
                        disabled={deletingId === code.id}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        {deletingId === code.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
