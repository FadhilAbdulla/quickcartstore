"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Moon, Sun, Palette } from "lucide-react"

export function SettingsManager({ initialTheme }: { initialTheme: string }) {
  const [theme, setTheme] = useState(initialTheme)
  const [loading, setLoading] = useState(false)

  const handleThemeChange = async (newTheme: string) => {
    if (newTheme === theme) return
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      })
      if (!res.ok) { toast.error("Failed to update theme"); return }
      setTheme(newTheme)
      toast.success(`Theme changed to ${newTheme}. Visitors will see the new theme on next page load.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="h-4 w-4 text-blue-400" />
          <h2 className="text-white font-semibold">Site Theme</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Changes apply globally — all visitors will see the selected theme.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange("dark")}
            disabled={loading}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
              theme === "dark"
                ? "border-blue-500 bg-blue-600/10"
                : "border-[#2a2a2a] hover:border-[#3a3a3a]"
            }`}
          >
            {theme === "dark" && (
              <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            )}
            <div className="h-20 w-full rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] flex flex-col p-2 gap-1.5">
              <div className="h-2 w-16 rounded bg-[#1e1e1e]" />
              <div className="flex gap-1 flex-1">
                <div className="w-8 rounded bg-[#111111]" />
                <div className="flex-1 rounded bg-[#111111]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">Dark</span>
            </div>
          </button>

          <button
            onClick={() => handleThemeChange("light")}
            disabled={loading}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
              theme === "light"
                ? "border-blue-500 bg-blue-600/10"
                : "border-[#2a2a2a] hover:border-[#3a3a3a]"
            }`}
          >
            {theme === "light" && (
              <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            )}
            <div className="h-20 w-full rounded-lg bg-white border border-gray-200 flex flex-col p-2 gap-1.5">
              <div className="h-2 w-16 rounded bg-gray-200" />
              <div className="flex gap-1 flex-1">
                <div className="w-8 rounded bg-gray-100" />
                <div className="flex-1 rounded bg-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">Light</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
