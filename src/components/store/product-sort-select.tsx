"use client"

export function ProductSortSelect({ currentSort }: { currentSort?: string }) {
  return (
    <select
      onChange={(e) => {
        const url = new URL(window.location.href)
        url.searchParams.set("sort", e.target.value)
        window.location.href = url.toString()
      }}
      defaultValue={currentSort || ""}
      className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">Sort: Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="newest">Newest First</option>
    </select>
  )
}
