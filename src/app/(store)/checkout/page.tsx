"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2, Tag, X } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

const emirates = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]

interface AppliedPromo {
  id: string
  code: string
  discountType: string
  discountValue: number
  discount: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [promoInput, setPromoInput] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", line1: "", line2: "", city: "", emirate: "", notes: "" })
  const [vatRate, setVatRate] = useState(5)
  const [processingRate, setProcessingRate] = useState(0)

  useEffect(() => {
    if (session?.user) setForm((f) => ({ ...f, name: session.user?.name || "" }))
  }, [session])

  useEffect(() => {
    fetch("/api/settings/charges")
      .then((r) => r.json())
      .then((d) => { setVatRate(d.vatRate); setProcessingRate(d.processingRate) })
      .catch(() => {})
  }, [])

  const subtotal = totalPrice()
  const promoDiscount = appliedPromo?.discount ?? 0
  const afterDiscount = Math.max(0, subtotal - promoDiscount)
  const vat = afterDiscount * (vatRate / 100)
  const processingFee = afterDiscount * (processingRate / 100)
  const grandTotal = afterDiscount + vat + processingFee

  const applyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    try {
      const res = await fetch("/api/promocodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, orderAmount: subtotal }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      setAppliedPromo(data)
      toast.success(`Promo applied — ${data.discountType === "PERCENTAGE" ? `${data.discountValue}%` : formatPrice(data.discountValue)} off!`)
    } finally {
      setPromoLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Your cart is empty</p>
          <Button asChild><Link href="/products">Browse Laptops</Link></Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.emirate) { toast.error("Please select an emirate"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: form,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
          totalAmount: grandTotal,
          promoCodeId: appliedPromo?.id ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to place order"); return }
      clearCart()
      toast.success("Order placed successfully!")
      router.push(`/orders/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
                <h2 className="text-white font-semibold mb-5">Delivery Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ahmed Al Mansouri" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 50 000 0000" required />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Address Line 1</Label>
                    <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Building name, street, area" required />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Address Line 2 (optional)</Label>
                    <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Apartment, floor, landmark" />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Dubai" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Emirate</Label>
                    <Select value={form.emirate} onValueChange={(v) => setForm({ ...form, emirate: v })}>
                      <SelectTrigger><SelectValue placeholder="Select emirate" /></SelectTrigger>
                      <SelectContent>
                        {emirates.map((em) => <SelectItem key={em} value={em}>{em}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Order Notes (optional)</Label>
                    <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special delivery instructions?" />
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-400" />Promo Code
                </h2>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-600/10 border border-green-600/25">
                    <div>
                      <p className="text-green-400 font-mono font-semibold text-sm">{appliedPromo.code}</p>
                      <p className="text-green-400/70 text-xs">
                        {appliedPromo.discountType === "PERCENTAGE"
                          ? `${appliedPromo.discountValue}% off`
                          : `${formatPrice(appliedPromo.discountValue)} off`}
                        {" — saving "}{formatPrice(appliedPromo.discount)}
                      </p>
                    </div>
                    <button type="button" onClick={() => { setAppliedPromo(null); setPromoInput("") }} className="text-gray-500 hover:text-red-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="font-mono uppercase"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                    />
                    <Button type="button" variant="outline" onClick={applyPromo} disabled={promoLoading || !promoInput.trim()}>
                      {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
                <h2 className="text-white font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-600/30 bg-blue-950/20">
                  <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-gray-500 text-xs">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Placing Order...</> : <><CheckCircle className="h-4 w-4" />Place Order — {formatPrice(grandTotal)}</>}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-[#111111] border border-[#1e1e1e] p-6">
              <h2 className="text-white font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#0f0f0f] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.image
                        ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-1" />
                        : <span className="text-gray-700 text-[10px]">IMG</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">× {item.quantity}</p>
                    </div>
                    <span className="text-white text-xs font-medium shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1e1e1e] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo ({appliedPromo.code})</span>
                    <span>-{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}
                {vatRate > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>VAT ({vatRate}%)</span><span>{formatPrice(vat)}</span>
                  </div>
                )}
                {processingRate > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Processing ({processingRate}%)</span><span>{formatPrice(processingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span><span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-base pt-1 border-t border-[#1e1e1e]">
                  <span>Total</span><span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
