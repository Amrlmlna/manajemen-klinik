"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CurrencyDisplay } from "@/components/ui/currency-display"

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
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground text-sm">{profile?.clinic_name}</p>
        </div>

        {/* Mobile-friendly stats cards - single column on mobile */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="text-2xl font-bold">
                <CurrencyDisplay amount={stats.thisMonthRevenue} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/reports" className="text-blue-600 hover:underline">
                  View reports
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule - Mobile optimized */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Schedule</CardTitle>
            <Link href="/controls?filter=today">
              <Button variant="outline" size="sm" className="hidden md:flex">
                View All
              </Button>
              <Button variant="outline" size="sm" className="md:hidden">
                All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayControls.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No controls scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayControls.slice(0, 5).map((control) => (
                  <div
                    key={control.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {control.patients.first_name} {control.patients.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{control.control_type}</p>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="font-medium">{new Date(control.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <Badge className="mt-1 sm:mt-1">{control.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Mobile optimized */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <Link href="/patients/new">
                <Button className="w-full bg-transparent" variant="outline">
                  <span className="truncate">Add Patient</span>
                </Button>
              </Link>
              <Link href="/controls/new">
                <Button className="w-full bg-transparent" variant="outline">
                  <span className="truncate">Schedule Control</span>
                </Button>
              </Link>
              <Link href="/schedules/new">
                <Button className="w-full bg-transparent" variant="outline">
                  <span className="truncate">Create Schedule</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full bg-transparent" variant="outline">
                  <span className="truncate">View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}