"use client"

import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/context/currency-context"
import Link from "next/link"
import Image from "next/image"

export function CartDrawer() {
  const currency = useCurrency()
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()
  const total = totalPrice()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Cart{" "}
              {items.length > 0 && (
                <span className="text-gray-400 text-sm font-normal">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-white font-medium">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-1">Add some laptops to get started</p>
              </div>
              <Button onClick={closeCart} asChild>
                <Link href="/products">Browse Laptops</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#222222]">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-[#111111] flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ShoppingCart className="h-8 w-8 text-gray-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-400 font-medium mb-0.5">{item.product.brand}</p>
                  <p className="text-white text-sm font-medium leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-blue-400 font-semibold text-sm mt-1">
                    {formatPrice(item.product.price, currency)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-6 w-6 rounded-md bg-[#111111] border border-[#333333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#444444] transition-colors"
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
                        className="h-6 w-6 rounded-md bg-[#111111] border border-[#333333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#444444] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#1e1e1e] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-semibold text-lg">{formatPrice(total, currency)}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
            <Button
              asChild
              className="w-full h-12 text-base"
              onClick={closeCart}
            >
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
