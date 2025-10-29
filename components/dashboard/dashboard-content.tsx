"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardContentProps {
  profile: any
  stats: {
    totalPatients: number
    totalControls: number
    todayControls: number
    thisMonthRevenue: number
  }
  todayControls: any[]
}

export function DashboardContent({ profile, stats, todayControls }: DashboardContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.clinic_name}</h1>
          <p className="text-muted-foreground">Here's what's happening at your clinic today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/patients" className="text-blue-600 hover:underline">
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalControls}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/controls" className="text-blue-600 hover:underline">
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayControls}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/controls?filter=today" className="text-blue-600 hover:underline">
                  View schedule
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.thisMonthRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/reports" className="text-blue-600 hover:underline">
                  View reports
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Link href="/controls?filter=today">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todayControls.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No controls scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayControls.slice(0, 5).map((control) => (
                  <div
                    key={control.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {control.patients.first_name} {control.patients.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{control.control_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(control.scheduled_date).toLocaleTimeString()}</p>
                      <Badge className="mt-1">{control.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/patients/new">
                <Button className="w-full bg-transparent" variant="outline">
                  Add Patient
                </Button>
              </Link>
              <Link href="/controls/new">
                <Button className="w-full bg-transparent" variant="outline">
                  Schedule Control
                </Button>
              </Link>
              <Link href="/schedules/new">
                <Button className="w-full bg-transparent" variant="outline">
                  Create Schedule
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full bg-transparent" variant="outline">
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
