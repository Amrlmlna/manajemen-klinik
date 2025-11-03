"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, DollarSign, FileText } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    totalPatients: number
    totalControls: number
    todayControls: number
    thisMonthRevenue: number
  }
  patients: any[] // List of clinic patients
  controls: any[] // List of clinic controls
}

export function AdminDashboard({ stats, patients, controls }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Mobile-friendly stats cards grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">In your clinic</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalControls}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayControls}</div>
            <p className="text-xs text-muted-foreground mt-1">For today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.thisMonthRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Clinic-specific management with mobile-optimized tabs */}
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="patients" className="flex-1 min-w-[120px]">Patients</TabsTrigger>
          <TabsTrigger value="controls" className="flex-1 min-w-[120px]">Controls</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-[120px]">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No patients registered yet</p>
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Last Control</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.slice(0, 10).map((patient) => (
                        <tr key={patient.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-4 font-medium">
                            {patient.first_name} {patient.last_name}
                          </td>
                          <td className="px-4 py-4 text-sm">{patient.email}</td>
                          <td className="px-4 py-4 text-sm">{patient.phone}</td>
                          <td className="px-4 py-4 text-sm">
                            {patient.last_control_date || 'Never'}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <Badge variant="secondary">Active</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Controls</CardTitle>
            </CardHeader>
            <CardContent>
              {controls.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming controls scheduled</p>
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Patient</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {controls.slice(0, 10).map((control) => (
                        <tr key={control.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-4 font-medium">
                            {control.patient?.first_name} {control.patient?.last_name}
                          </td>
                          <td className="px-4 py-4 text-sm">{control.control_type}</td>
                          <td className="px-4 py-4 text-sm">
                            {new Date(control.scheduled_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {new Date(control.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <Badge className={getControlStatusClass(control.status)}>
                              {control.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <CardTitle>Monthly Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Controls</p>
                    <p className="text-2xl font-bold">{stats.totalControls}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${stats.thisMonthRevenue.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Controls per Patient</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPatients > 0 ? (stats.totalControls / stats.totalPatients).toFixed(2) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinic Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Retention</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Control Completion</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="font-semibold">+12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to determine badge class based on control status
function getControlStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
}