"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"
import { Trash2, Plus, Save } from "lucide-react"

interface Brand { id: string; name: string }
interface Category { id: string; name: string; slug: string }

interface ProductFormProps {
  brands: Brand[]
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    comparePrice?: number
    images: string[]
    brandId: string
    categoryId: string
    specs: Record<string, string>
    stock: number
    sku: string
    isActive: boolean
    isFeatured: boolean
  }
}

const defaultSpecs = [
  { key: "processor", label: "Processor" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "display", label: "Display" },
  { key: "graphics", label: "Graphics" },
  { key: "battery", label: "Battery" },
  { key: "weight", label: "Weight" },
  { key: "os", label: "Operating System" },
]

export function ProductForm({ brands, categories, product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    comparePrice: product?.comparePrice?.toString() || "",
    brandId: product?.brandId || "",
    categoryId: product?.categoryId || "",
    stock: product?.stock?.toString() || "0",
    sku: product?.sku || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images || [""],
    specs: product?.specs || {} as Record<string, string>,
  })

  const updateSpec = (key: string, value: string) => {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }))
  }

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
      sku: isEdit ? f.sku : name.replace(/\s+/g, "-").toUpperCase().slice(0, 20),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredSpecs: Record<string, string> = {}
    Object.entries(form.specs).forEach(([k, v]) => {
      if (v) filteredSpecs[k] = v
    })

    setLoading(true)
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        images: form.images.filter(Boolean),
        specs: filteredSpecs,
      }

      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to save product")
        return
      }
      toast.success(isEdit ? "Product updated!" : "Product created!")
      router.push("/admin/products")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm("Delete this product? This cannot be undone.")) return
    setLoading(true)
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
      toast.success("Product deleted")
      router.push("/admin/products")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 space-y-5">
            <h2 className="text-white font-semibold">Basic Information</h2>

            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Apple MacBook Pro 14-inch M4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="apple-macbook-pro-14-m4"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="APPLE-MBP14-M4"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the laptop in detail..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Select
                  value={form.brandId}
                  onValueChange={(v) => setForm({ ...form, brandId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold mb-5">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultSpecs.map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    value={form.specs[key] || ""}
                    onChange={(e) => updateSpec(key, e.target.value)}
                    placeholder={`e.g. Apple M4 Pro`}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold mb-5">Images (URLs)</h2>
            <div className="space-y-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const imgs = [...form.images]
                      imgs[idx] = e.target.value
                      setForm({ ...form, images: imgs })
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const imgs = form.images.filter((_, i) => i !== idx)
                      setForm({ ...form, images: imgs.length ? imgs : [""] })
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Image URL
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 space-y-4">
            <h2 className="text-white font-semibold">Pricing</h2>
            <div className="space-y-2">
              <Label>Price (AED) *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="5999.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Compare Price (AED)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                placeholder="6999.00"
              />
              <p className="text-xs text-gray-500">Original price before discount</p>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 space-y-4">
            <h2 className="text-white font-semibold">Inventory</h2>
            <div className="space-y-2">
              <Label>Stock Quantity *</Label>
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 space-y-4">
            <h2 className="text-white font-semibold">Settings</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300 text-sm">Active (visible to customers)</span>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  form.isActive ? "bg-blue-600" : "bg-[#2a2a2a]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    form.isActive ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300 text-sm">Featured on homepage</span>
              <button
                type="button"
                onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  form.isFeatured ? "bg-blue-600" : "bg-[#2a2a2a]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    form.isFeatured ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full h-11" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </Button>
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={loading}
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
