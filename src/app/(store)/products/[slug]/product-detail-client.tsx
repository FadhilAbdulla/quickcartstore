"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, ArrowLeft, Check, ChevronRight, Package, Truck, Shield } from "lucide-react"
import { useCartStore, CartProduct } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/store/product-card"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  brand: { name: string }
  category: { name: string }
  specs: Record<string, string>
  stock: number
  sku: string
  isFeatured: boolean
}

interface ProductDetailClientProps {
  product: Product
  related: any[]
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
      brand: product.brand.name,
      stock: product.stock,
    }
    addItem(cartProduct, quantity)
    setAdded(true)
    toast.success(`${quantity}x ${product.name} added to cart`)
    setTimeout(() => setAdded(false), 2000)
  }

  const specEntries = Object.entries(product.specs || {}).filter(([, v]) => v)

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-white transition-colors">Laptops</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/products?brand=${product.brand.name.toLowerCase()}`} className="hover:text-white transition-colors">
            {product.brand.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/3] bg-[#111111] rounded-2xl border border-[#1e1e1e] flex items-center justify-center overflow-hidden mb-4">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="text-gray-700 flex flex-col items-center gap-2">
                  <ShoppingCart className="h-16 w-16" />
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl border-2 transition-all overflow-hidden bg-[#111111] ${
                      selectedImage === idx
                        ? "border-blue-500"
                        : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default">{product.brand.name}</Badge>
              <Badge variant="secondary">{product.category.name}</Badge>
              {product.isFeatured && <Badge>Featured</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <Badge variant="destructive">Save {discount}%</Badge>
                </>
              )}
            </div>

            {/* SKU & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-500 text-sm">SKU: {product.sku}</span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className={`text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">{product.description}</p>

            {/* Specs preview */}
            {specEntries.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6 p-4 rounded-xl bg-[#111111] border border-[#1e1e1e]">
                {specEntries.slice(0, 6).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-400 text-sm">Quantity:</span>
                <div className="flex items-center gap-2 border border-[#2a2a2a] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA */}
            <Button
              size="lg"
              className="w-full h-13 text-base mb-3"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </>
              )}
            </Button>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#1e1e1e]">
              {[
                { icon: Truck, label: "Free Delivery", sub: "UAE wide" },
                { icon: Shield, label: "UAE Warranty", sub: "1–2 years" },
                { icon: Package, label: "Easy Returns", sub: "14 days" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                  <item.icon className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-xs font-medium">{item.label}</span>
                  <span className="text-gray-500 text-[10px]">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Specs Table */}
        {specEntries.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">Full Specifications</h2>
            <div className="rounded-xl border border-[#1e1e1e] overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specEntries.map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={`${idx % 2 === 0 ? "bg-[#111111]" : "bg-[#0f0f0f]"} border-b border-[#1a1a1a] last:border-0`}
                    >
                      <td className="py-3 px-5 text-gray-500 capitalize w-1/3">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-5 text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">More from {product.brand.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
