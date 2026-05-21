"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Percent, DollarSign, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CURRENCIES = [
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "USD", label: "USD — US Dollar" },
]

interface SettingsManagerProps {
  initialTheme: string
  initialVatRate: number
  initialProcessingRate: number
  initialCurrency: string
  initialShippingFee: number
}

export function SettingsManager({ initialVatRate, initialProcessingRate, initialCurrency, initialShippingFee }: SettingsManagerProps) {
  const [vatRate, setVatRate] = useState(String(initialVatRate))
  const [processingRate, setProcessingRate] = useState(String(initialProcessingRate))
  const [chargesLoading, setChargesLoading] = useState(false)
  const [currency, setCurrency] = useState(initialCurrency)
  const [currencyLoading, setCurrencyLoading] = useState(false)
  const [shippingFee, setShippingFee] = useState(String(initialShippingFee))
  const [shippingLoading, setShippingLoading] = useState(false)

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

  const handleCurrencyChange = async (newCurrency: string) => {
    if (newCurrency === currency) return
    setCurrencyLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: newCurrency }),
      })
      if (!res.ok) { toast.error("Failed to update currency"); return }
      setCurrency(newCurrency)
      toast.success(`Currency changed to ${newCurrency}`)
    } finally {
      setCurrencyLoading(false)
    }
  }

  const handleShippingSave = async () => {
    const fee = parseFloat(shippingFee)
    if (isNaN(fee) || fee < 0) { toast.error("Shipping fee must be 0 or greater"); return }
    setShippingLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingFee: fee }),
      })
      if (!res.ok) { toast.error("Failed to save shipping fee"); return }
      toast.success("Shipping fee updated successfully")
    } finally {
      setShippingLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[#dde6f0] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Percent className="h-4 w-4" style={{ color: "#0066BA" }} />
          <h2 className="font-semibold" style={{ color: "#072654" }}>Order Charges</h2>
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

        <Button onClick={handleChargesSave} disabled={chargesLoading} style={{ backgroundColor: "#0066BA" }}>
          {chargesLoading ? "Saving..." : "Save Charges"}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#dde6f0] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-4 w-4" style={{ color: "#0066BA" }} />
          <h2 className="font-semibold" style={{ color: "#072654" }}>Currency</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Sets the currency used across the store for displaying prices.
        </p>
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label>Store Currency</Label>
            <Select value={currency} onValueChange={handleCurrencyChange} disabled={currencyLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dde6f0] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Truck className="h-4 w-4" style={{ color: "#0066BA" }} />
          <h2 className="font-semibold" style={{ color: "#072654" }}>Shipping</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Flat shipping fee added to every order. Set to 0 for free shipping.
        </p>
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label>Shipping Fee</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              placeholder="0"
            />
          </div>
          <Button onClick={handleShippingSave} disabled={shippingLoading} style={{ backgroundColor: "#0066BA" }}>
            {shippingLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
