"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Moon, Sun, Palette, Percent } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface SettingsManagerProps {
  initialTheme: string
  initialVatRate: number
  initialProcessingRate: number
}

export function SettingsManager({ initialTheme, initialVatRate, initialProcessingRate }: SettingsManagerProps) {
  const [theme, setTheme] = useState(initialTheme)
  const [themeLoading, setThemeLoading] = useState(false)
  const [vatRate, setVatRate] = useState(String(initialVatRate))
  const [processingRate, setProcessingRate] = useState(String(initialProcessingRate))
  const [chargesLoading, setChargesLoading] = useState(false)

  const handleThemeChange = async (newTheme: string) => {
    if (newTheme === theme) return
    setThemeLoading(true)
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
      setThemeLoading(false)
    }
  }

  const handleChargesSave = async () => {
    const vat = parseFloat(vatRate)
    const proc = parseFloat(processingRate)
    if (isNaN(vat) || vat < 0 || vat > 100) { toast.error("VAT rate must be between 0 and 100"); return }
    if (isNaN(proc) || proc < 0 || proc > 100) { toast.error("Processing rate must be between 0 and 100"); return }
    setChargesLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vatRate: vat, processingRate: proc }),
      })
      if (!res.ok) { toast.error("Failed to save charges"); return }
      toast.success("Charges updated successfully")
    } finally {
      setChargesLoading(false)
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
            disabled={themeLoading}
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
            disabled={themeLoading}
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

      <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Percent className="h-4 w-4 text-blue-400" />
          <h2 className="text-white font-semibold">Order Charges</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Both charges are calculated as a percentage of the order subtotal (after any discount).
          Set to 0 to disable.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="space-y-2">
            <Label>VAT Rate (%)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Processing Charge (%)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={processingRate}
                onChange={(e) => setProcessingRate(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>

        <Button onClick={handleChargesSave} disabled={chargesLoading}>
          {chargesLoading ? "Saving..." : "Save Charges"}
        </Button>
      </div>
    </div>
  )
}
