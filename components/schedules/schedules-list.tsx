"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Schedule {
  id: string
  control_type: string
  frequency: string
  start_date: string
  end_date: string | null
  is_active: boolean
  cost: number | null
  patients: {
    first_name: string
    last_name: string
  }
}

interface SchedulesListProps {
  schedules: Schedule[]
}

export function SchedulesList({ schedules }: SchedulesListProps) {
  if (schedules.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No recurring schedules created</p>
        <Link href="/schedules/new">
          <Button>Create Your First Schedule</Button>
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
            <th className="px-6 py-3 text-left text-sm font-semibold">Frequency</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Start Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Cost</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="border-t hover:bg-muted/50">
              <td className="px-6 py-4">
                <span className="font-medium">
                  {schedule.patients.first_name} {schedule.patients.last_name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{schedule.control_type}</td>
              <td className="px-6 py-4 text-sm capitalize">{schedule.frequency}</td>
              <td className="px-6 py-4 text-sm">{new Date(schedule.start_date).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <Badge className={schedule.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {schedule.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm">${schedule.cost?.toFixed(2) || "-"}</td>
              <td className="px-6 py-4">
                <Link href={`/schedules/${schedule.id}`}>
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
