"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

export function ReturnActionButtons({ returnId }: { returnId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [refundAmount, setRefundAmount] = useState("")
  const [notes, setNotes] = useState("")

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/returns/${returnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "APPROVED" : "REJECTED",
          refundAmount: action === "approve" && refundAmount ? parseFloat(refundAmount) : null,
          notes,
        }),
      })
      if (!res.ok) {
        toast.error("Failed to update return")
        return
      }
      toast.success(`Return ${action === "approve" ? "approved" : "rejected"}!`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Refund Amount (AED)</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={refundAmount}
          onChange={(e) => setRefundAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <div className="space-y-2">
        <Label>Admin Notes</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => handleAction("approve")}
          disabled={loading}
          className="flex-1"
          size="sm"
        >
          <Check className="h-4 w-4" />
          Approve
        </Button>
        <Button
          onClick={() => handleAction("reject")}
          disabled={loading}
          variant="destructive"
          className="flex-1"
          size="sm"
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  )
}
