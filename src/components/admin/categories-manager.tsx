"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Check, X, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { slugify } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", slug: "" })
  const [editForm, setEditForm] = useState({ name: "", slug: "" })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error("Name is required")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, slug: form.slug || slugify(form.name) }),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setCategories((prev) => [...prev, { ...data, _count: { products: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
      setForm({ name: "", slug: "" })
      setAdding(false)
      toast.success("Category added")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (cat: Category) => {
    setEditId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug })
  }

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) return toast.error("Name is required")
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: data.name, slug: data.slug } : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditId(null)
      toast.success("Category updated")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cat: Category) => {
    if (cat._count.products > 0) return toast.error(`Cannot delete — ${cat._count.products} products use this category`)
    if (!confirm(`Delete category "${cat.name}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      toast.success("Category deleted")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setAdding(true); setForm({ name: "", slug: "" }) }} size="sm">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {adding && (
        <div className="bg-[#111111] border border-blue-600/30 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })}
                placeholder="e.g. Gaming"
                autoFocus
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. gaming" />
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
              <th className="text-left text-gray-500 font-medium px-5 py-3">Name</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Slug</th>
              <th className="text-left text-gray-500 font-medium px-4 py-3">Products</th>
              <th className="text-right text-gray-500 font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <FolderOpen className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No categories yet</p>
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-5 py-3">
                  {editId === cat.id ? (
                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value, slug: slugify(e.target.value) })} className="h-8 text-sm" autoFocus />
                  ) : (
                    <span className="text-white font-medium">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editId === cat.id ? (
                    <Input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} className="h-8 text-sm font-mono" />
                  ) : (
                    <span className="text-gray-500 text-xs font-mono">{cat.slug}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">{cat._count.products}</td>
                <td className="px-5 py-3 text-right">
                  {editId === cat.id ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(cat.id)} disabled={loading} className="text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => startEdit(cat)} className="text-gray-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(cat)} disabled={loading} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
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
