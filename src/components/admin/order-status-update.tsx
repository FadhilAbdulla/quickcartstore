"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        toast.error("Failed to update order status")
        return
      }
      toast.success("Order status updated!")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="w-full"
        size="sm"
      >
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  )
}
