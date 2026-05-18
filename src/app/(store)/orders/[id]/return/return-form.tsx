"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Package, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/context/currency-context"

const RETURN_REASONS = [
  "Item arrived damaged",
  "Wrong item received",
  "Item not as described",
  "Changed my mind",
  "Found a better price",
  "Other",
]

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number | string
  product: {
    name: string
    images: string[]
    brand: { name: string }
  }
}

interface ReturnRecord {
  productId: string
}

interface Order {
  id: string
  items: OrderItem[]
  returns: ReturnRecord[]
}

export function ReturnForm({ order }: { order: Order }) {
  const currency = useCurrency()
  const router = useRouter()
  const [selectedItemId, setSelectedItemId] = useState("")
  const [reason, setReason] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [loading, setLoading] = useState(false)

  const alreadyReturnedProductIds = new Set(order.returns.map((r) => r.productId))
  const eligibleItems = order.items.filter((i) => !alreadyReturnedProductIds.has(i.productId))

  const selectedItem = eligibleItems.find((i) => i.id === selectedItemId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem || !reason) { toast.error("Please fill in all fields"); return }
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1 || qty > selectedItem.quantity) {
      toast.error(`Quantity must be between 1 and ${selectedItem.quantity}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          productId: selectedItem.productId,
          reason,
          quantity: qty,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to submit return"); return }
      toast.success("Return request submitted successfully")
      router.push(`/orders/${order.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (eligibleItems.length === 0) {
    return (
      <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-8 text-center">
        <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
        <p className="text-white font-medium">All items have already been returned</p>
        <p className="text-gray-500 text-sm mt-1">There are no more items eligible for return on this order.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 space-y-5">

        {/* Item selection */}
        <div className="space-y-2">
          <Label>Select Item to Return</Label>
          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an item" />
            </SelectTrigger>
            <SelectContent>
              {eligibleItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.product.brand.name} — {item.product.name} (×{item.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected item preview */}
        {selectedItem && (
          <div className="flex gap-4 p-3 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e]">
            <div className="w-14 h-14 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
              {selectedItem.product.images[0] ? (
                <img src={selectedItem.product.images[0]} alt={selectedItem.product.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Package className="h-5 w-5 text-gray-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-400">{selectedItem.product.brand.name}</p>
              <p className="text-white text-sm font-medium truncate">{selectedItem.product.name}</p>
              <p className="text-gray-500 text-xs">{formatPrice(Number(selectedItem.price), currency)} × {selectedItem.quantity}</p>
            </div>
          </div>
        )}

        {/* Quantity */}
        {selectedItem && (
          <div className="space-y-2">
            <Label>Quantity to Return</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: selectedItem.quantity }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reason */}
        <div className="space-y-2">
          <Label>Reason for Return</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {RETURN_REASONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg bg-amber-950/20 border border-amber-600/20 p-3 text-amber-400/80 text-xs">
          Returns are reviewed within 2–3 business days. You will be contacted once your request is processed.
        </div>
      </div>

      <Button type="submit" className="w-full h-11" disabled={loading || !selectedItemId || !reason}>
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : "Submit Return Request"}
      </Button>
    </form>
  )
}
