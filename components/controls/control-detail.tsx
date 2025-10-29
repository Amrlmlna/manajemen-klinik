"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ControlDetailProps {
  control: any
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-yellow-100 text-yellow-800",
}

export function ControlDetail({ control }: ControlDetailProps) {
  const [status, setStatus] = useState(control.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    const supabase = createClient()
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("controls")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", control.id)

      if (error) throw error
      setStatus(newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">Control Details</h2>
          <p className="text-muted-foreground">ID: {control.id}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Close
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {control.patients.first_name} {control.patients.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{control.patients.email || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Control Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Control Type</p>
              <p className="font-medium">{control.control_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date</p>
              <p className="font-medium">{new Date(control.scheduled_date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="font-medium">${control.cost?.toFixed(2) || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Status</p>
              <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Update Status</p>
              <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {control.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{control.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
