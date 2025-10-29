"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Control {
  id: string
  control_type: string
  scheduled_date: string
  status: string
  cost: number | null
  patients: {
    first_name: string
    last_name: string
    email: string | null
  }
}

interface ControlsListProps {
  controls: Control[]
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-yellow-100 text-yellow-800",
}

export function ControlsList({ controls }: ControlsListProps) {
  if (controls.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No controls scheduled</p>
        <Link href="/controls/new">
          <Button>Schedule Your First Control</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Control Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Scheduled Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Cost</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {controls.map((control) => (
            <tr key={control.id} className="border-t hover:bg-muted/50">
              <td className="px-6 py-4">
                <span className="font-medium">
                  {control.patients.first_name} {control.patients.last_name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{control.control_type}</td>
              <td className="px-6 py-4 text-sm">{new Date(control.scheduled_date).toLocaleString()}</td>
              <td className="px-6 py-4">
                <Badge className={statusColors[control.status] || "bg-gray-100 text-gray-800"}>{control.status}</Badge>
              </td>
              <td className="px-6 py-4 text-sm">${control.cost?.toFixed(2) || "-"}</td>
              <td className="px-6 py-4">
                <Link href={`/controls/${control.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
