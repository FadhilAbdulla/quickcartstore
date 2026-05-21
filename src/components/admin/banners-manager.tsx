"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  ctaText: string | null
  ctaLink: string | null
  image: string | null
  bgFrom: string
  bgTo: string
  isActive: boolean
  sortOrder: number
}

interface BannersManagerProps {
  initialBanners: Banner[]
}

const EMPTY: Omit<Banner, "id" | "sortOrder"> = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
  image: "",
  bgFrom: "#072654",
  bgTo: "#0a3d7a",
  isActive: true,
}

export function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [form, setForm] = useState({ ...EMPTY })
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const resetForm = () => {
    setForm({ ...EMPTY })
    setEditId(null)
    setShowForm(false)
  }

  const startEdit = (b: Banner) => {
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      ctaText: b.ctaText ?? "",
      ctaLink: b.ctaLink ?? "",
      image: b.image ?? "",
      bgFrom: b.bgFrom,
      bgTo: b.bgTo,
      isActive: b.isActive,
    })
    setEditId(b.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Banner title is required"); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        subtitle: form.subtitle || null,
        ctaText: form.ctaText || null,
        ctaLink: form.ctaLink || null,
        image: form.image || null,
      }

      if (editId) {
        const res = await fetch("/api/admin/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        })
        if (!res.ok) { toast.error("Failed to update banner"); return }
        const updated = await res.json()
        setBanners((prev) => prev.map((b) => (b.id === editId ? updated : b)))
        toast.success("Banner updated")
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, sortOrder: banners.length }),
        })
        if (!res.ok) { toast.error("Failed to create banner"); return }
        const created = await res.json()
        setBanners((prev) => [...prev, created])
        toast.success("Banner created")
      }
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (b: Banner) => {
    const res = await fetch("/api/admin/banners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, isActive: !b.isActive }),
    })
    if (!res.ok) { toast.error("Failed to update"); return }
    const updated = await res.json()
    setBanners((prev) => prev.map((x) => (x.id === b.id ? updated : x)))
    toast.success(updated.isActive ? "Banner activated" : "Banner deactivated")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return
    const res = await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Failed to delete"); return }
    setBanners((prev) => prev.filter((b) => b.id !== id))
    toast.success("Banner deleted")
  }

  return (
    <div className="space-y-6">
      {/* Banner form */}
      {showForm ? (
        <div className="bg-white rounded-xl border border-[#dde6f0] p-6 shadow-sm">
          <h2 className="font-semibold mb-5" style={{ color: "#072654" }}>
            {editId ? "Edit Banner" : "New Banner"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Title <span style={{ color: "#ED1D32" }}>*</span></Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Summer Tech Sale — Up to 30% Off"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={form.subtitle ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="e.g. Laptops, monitors, components & more at unbeatable prices"
              />
            </div>

            <div className="space-y-2">
              <Label>CTA Button Text</Label>
              <Input
                value={form.ctaText ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, ctaText: e.target.value }))}
                placeholder="e.g. Shop Now"
              />
            </div>

            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input
                value={form.ctaLink ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, ctaLink: e.target.value }))}
                placeholder="e.g. /products?featured=true"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Banner Image URL</Label>
              <Input
                value={form.image ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://... (leave blank for text-only banner)"
              />
            </div>

            <div className="space-y-2">
              <Label>Background — Start Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.bgFrom}
                  onChange={(e) => setForm((p) => ({ ...p, bgFrom: e.target.value }))}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-[#dde6f0]"
                />
                <Input
                  value={form.bgFrom}
                  onChange={(e) => setForm((p) => ({ ...p, bgFrom: e.target.value }))}
                  className="font-mono"
                  placeholder="#072654"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background — End Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.bgTo}
                  onChange={(e) => setForm((p) => ({ ...p, bgTo: e.target.value }))}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-[#dde6f0]"
                />
                <Input
                  value={form.bgTo}
                  onChange={(e) => setForm((p) => ({ ...p, bgTo: e.target.value }))}
                  className="font-mono"
                  placeholder="#0a3d7a"
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="mb-5">
            <Label className="mb-2 block text-xs text-gray-500">Preview</Label>
            <div
              className="rounded-xl p-6 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${form.bgFrom} 0%, ${form.bgTo} 100%)`, minHeight: "100px" }}
            >
              <h3 className="text-white font-bold text-xl mb-1">{form.title || "Banner Title"}</h3>
              {form.subtitle && <p className="text-blue-100 text-sm opacity-90">{form.subtitle}</p>}
              {form.ctaText && (
                <div className="mt-3">
                  <span className="inline-block px-4 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: "#0066BA" }}>
                    {form.ctaText}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={loading} style={{ backgroundColor: "#0066BA" }}>
              {loading ? "Saving..." : editId ? "Update Banner" : "Create Banner"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "#0066BA" }}>
            <Plus className="h-4 w-4 mr-2" /> New Banner
          </Button>
        </div>
      )}

      {/* Banners list */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#dde6f0] p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-4">No banners yet. Create your first hero banner!</p>
          <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "#0066BA" }}>
            <Plus className="h-4 w-4 mr-2" /> Create Banner
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b, idx) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-[#dde6f0] p-4 shadow-sm flex items-center gap-4"
            >
              <GripVertical className="h-4 w-4 text-gray-400 shrink-0 cursor-grab" />

              {/* Mini preview */}
              <div
                className="shrink-0 w-20 h-14 rounded-lg overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${b.bgFrom} 0%, ${b.bgTo} 100%)` }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm truncate" style={{ color: "#072654" }}>{b.title}</span>
                  <span
                    className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={b.isActive
                      ? { backgroundColor: "rgba(22,163,74,0.1)", color: "#16a34a" }
                      : { backgroundColor: "rgba(107,114,128,0.1)", color: "#6b7280" }
                    }
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {b.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Order: {b.sortOrder}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleActive(b)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#eef3fa] transition-colors"
                  title={b.isActive ? "Deactivate" : "Activate"}
                >
                  {b.isActive ? (
                    <Eye className="h-4 w-4" style={{ color: "#0066BA" }} />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(b)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#eef3fa] transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" style={{ color: "#072654" }} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" style={{ color: "#ED1D32" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
