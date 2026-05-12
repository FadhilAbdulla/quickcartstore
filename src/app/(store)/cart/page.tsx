"use client"

import Link from "next/link"
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()
  const vat = total * 0.05
  const grandTotal = total + vat

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some laptops to get started</p>
            <Button asChild size="lg">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Browse Laptops
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-5 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e]"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl bg-[#0f0f0f] flex items-center justify-center shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <ShoppingCart className="h-8 w-8 text-gray-700" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-400 text-xs font-medium mb-0.5">{item.product.brand}</p>
                    <h3 className="text-white font-medium leading-tight">{item.product.name}</h3>
                    <p className="text-blue-400 font-semibold mt-1">{formatPrice(item.product.price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 border border-[#2a2a2a] rounded-lg px-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.min(item.quantity + 1, item.product.stock)
                            )
                          }
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-[#111111] border border-[#1e1e1e] p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>VAT (5%)</span>
                    <span>{formatPrice(vat)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="border-t border-[#1e1e1e] pt-3 flex justify-between text-white font-semibold text-base">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <Button asChild className="w-full h-12 mt-6 text-base">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <div className="mt-4 text-center text-xs text-gray-600">
                  Secure checkout powered by SSL
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
