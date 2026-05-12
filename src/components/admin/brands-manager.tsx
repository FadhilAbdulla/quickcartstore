"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Brand {
  id: string
  name: string
  logo: string | null
  _count: { products: number }
}

export function BrandsManager({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState(initialBrands)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", logo: "" })
  const [editForm, setEditForm] = useState({ name: "", logo: "" })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error("Brand name is required")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setBrands((prev) => [...prev, { ...data, _count: { products: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
      setForm({ name: "", logo: "" })
      setAdding(false)
      toast.success("Brand added")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (brand: Brand) => {
    setEditId(brand.id)
    setEditForm({ name: brand.name, logo: brand.logo || "" })
  }

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) return toast.error("Brand name is required")
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setBrands((prev) =>
        prev.map((b) => (b.id === id ? { ...b, name: data.name, logo: data.logo } : b))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditId(null)
      toast.success("Brand updated")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (brand: Brand) => {
    if (brand._count.products > 0) return toast.error(`Cannot delete — ${brand._count.products} products use this brand`)
    if (!confirm(`Delete brand "${brand.name}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setBrands((prev) => prev.filter((b) => b.id !== brand.id))
      toast.success("Brand deleted")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setAdding(true); setForm({ name: "", logo: "" }) }} size="sm">
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {adding && (
        <div className="bg-[#111111] border border-blue-600/30 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">New Brand</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Apple" autoFocus />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Logo URL (optional)</label>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={loading} size="sm"><Check className="h-4 w-4" />Save</Button>
            <Button variant="outline" onClick={() => setAdding(false)} size="sm"><X className="h-4 w-4" />Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
              <th className="text-left text-gray-500 font-medium px-5 py-3">Brand</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Logo URL</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Products</th>
              <th className="text-right text-gray-500 font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <Tag className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No brands yet</p>
                </td>
              </tr>
            ) : brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-5 py-3">
                  {editId === brand.id ? (
                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-8 text-sm" autoFocus />
                  ) : (
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="h-7 w-7 object-contain rounded" />
                      ) : (
                        <div className="h-7 w-7 rounded bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-600 font-bold">
                          {brand.name[0]}
                        </div>
                      )}
                      <span className="text-white font-medium">{brand.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editId === brand.id ? (
                    <Input value={editForm.logo} onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })} className="h-8 text-sm" placeholder="https://..." />
                  ) : (
                    <span className="text-gray-500 text-xs truncate max-w-[180px] block">{brand.logo || "—"}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">{brand._count.products}</td>
                <td className="px-5 py-3 text-right">
                  {editId === brand.id ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(brand.id)} disabled={loading} className="text-green-400 hover:text-green-300 transition-colors"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => startEdit(brand)} className="text-gray-500 hover:text-blue-400 transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(brand)} disabled={loading} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
