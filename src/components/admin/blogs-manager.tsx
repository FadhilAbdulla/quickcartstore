"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  tags: string[]
  author: string
  isPublished: boolean
  publishedAt: string
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  author: "QuickCart Team",
  isPublished: true,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/blogs")
    const data = await res.json()
    setBlogs(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(b: Blog) {
    setEditing(b)
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage ?? "",
      tags: b.tags.join(", "),
      author: b.author,
      isPublished: b.isPublished,
    })
    setOpen(true)
  }

  async function save() {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      toast.error("Title, slug, excerpt and content are required")
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: form.coverImage || null,
    }
    try {
      const res = editing
        ? await fetch("/api/admin/blogs", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          })
        : await fetch("/api/admin/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
      if (!res.ok) throw new Error(await res.text())
      toast.success(editing ? "Blog updated" : "Blog created")
      setOpen(false)
      load()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(b: Blog) {
    await fetch("/api/admin/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, isPublished: !b.isPublished }),
    })
    load()
  }

  async function remove(b: Blog) {
    if (!confirm(`Delete "${b.title}"?`)) return
    await fetch(`/api/admin/blogs?id=${b.id}`, { method: "DELETE" })
    toast.success("Blog deleted")
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-0.5">{blogs.length} posts</p>
        </div>
        <Button onClick={openNew} style={{ backgroundColor: "#0066BA" }} className="text-white">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
            >
              {b.coverImage && (
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-20 h-14 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm truncate">{b.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      b.isPublished ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {b.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-gray-400 text-xs truncate">{b.excerpt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.tags.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(b)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title={b.isPublished ? "Unpublish" : "Publish"}
                >
                  {b.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(b)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <p className="text-gray-500 text-sm py-8 text-center">No blog posts yet. Create one!</p>
          )}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-10 px-4">
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 p-6 space-y-4"
            style={{ backgroundColor: "#0a1929" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setForm((f) => ({ ...f, title, slug: editing ? f.slug : slugify(title) }))
                  }}
                  placeholder="Best Laptops in UAE 2025"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300">Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="best-laptops-uae-2025"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300">Excerpt *</Label>
                <Textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="Short summary shown on blog list page…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300">Content * (Markdown supported)</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={12}
                  placeholder="Full article content…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-300">Cover Image URL</Label>
                  <Input
                    value={form.coverImage}
                    onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                    placeholder="https://…"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300">Author</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300">Tags (comma separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="laptops, dubai, gaming"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-gray-300 text-sm">Published</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={save}
                disabled={saving}
                style={{ backgroundColor: "#0066BA" }}
                className="text-white"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Post"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} className="border-white/20 text-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
