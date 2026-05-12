"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCartStore, CartProduct } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number | string
    comparePrice?: number | string | null
    images: string[]
    brand: { name: string }
    stock: number
    isFeatured?: boolean
    specs?: any
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [imgError, setImgError] = useState(false)
  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0
  const inStock = product.stock > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const cartProduct: CartProduct = {
      id: product.id, name: product.name, slug: product.slug,
      price, image: product.images[0] || "", brand: product.brand.name, stock: product.stock,
    }
    addItem(cartProduct)
    toast.success(`${product.name} added to cart`)
  }

  const showImage = product.images[0] && !imgError

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative rounded-2xl border border-[#1e1e1e] bg-[#111111] overflow-hidden transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl hover:shadow-blue-950/20 hover:-translate-y-1 flex flex-col h-full">

        {/* Badges — overlaid on image */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              -{discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Image — fixed height, no text overflow */}
        <div className="relative h-48 bg-[#0f0f0f] flex items-center justify-center shrink-0">
          {showImage ? (
            <img
              src={product.images[0]}
              alt=""
              onError={() => setImgError(true)}
              className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-700">
              <ShoppingCart className="h-10 w-10" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wide">{product.brand.name}</p>
          <h3 className="text-white font-medium text-sm leading-snug line-clamp-2 mb-3 group-hover:text-blue-100 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Spec tags */}
          {product.specs && (
            <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem]">
              {product.specs.ram && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400">
                  {product.specs.ram}
                </span>
              )}
              {product.specs.storage && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400">
                  {product.specs.storage}
                </span>
              )}
              {product.specs.processor && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 max-w-[130px] truncate">
                  {product.specs.processor}
                </span>
              )}
            </div>
          )}

          {/* Push price + stock + button to bottom */}
          <div className="mt-auto space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-white font-bold text-xl">{formatPrice(price)}</span>
              {comparePrice && comparePrice > price && (
                <span className="text-gray-500 text-sm line-through mb-0.5">{formatPrice(comparePrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
              <span className="text-xs text-gray-400">
                {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
              </span>
            </div>

            <Button className="w-full" size="sm" disabled={!inStock} onClick={handleAddToCart}>
              <ShoppingCart className="h-3.5 w-3.5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
