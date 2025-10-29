"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminDashboardProps {
  stats: {
    totalClinics: number
    totalPatients: number
    totalControls: number
    totalRevenue: number
  }
  clinics: any[]
}

export function AdminDashboard({ stats, clinics }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clinics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClinics}</div>
            <p className="text-xs text-muted-foreground mt-1">Active clinic accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalControls}</div>
            <p className="text-xs text-muted-foreground mt-1">Medical controls scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">System-wide revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Management */}
      <Tabs defaultValue="clinics" className="w-full">
        <TabsList>
          <TabsTrigger value="clinics">Clinic Management</TabsTrigger>
          <TabsTrigger value="analytics">System Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics">
          <Card>
            <CardHeader>
              <CardTitle>Registered Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              {clinics.length === 0 ? (
                <p className="text-muted-foreground">No clinics registered yet</p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Clinic Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Admin Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinics.map((clinic) => (
                        <tr key={clinic.id} className="border-t hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium">{clinic.clinic_name || "Unnamed Clinic"}</td>
                          <td className="px-6 py-4 text-sm">{clinic.email}</td>
                          <td className="px-6 py-4">
                            <Badge className="capitalize">{clinic.role}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">{new Date(clinic.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
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

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Patients per Clinic</p>
                    <p className="text-2xl font-bold">
                      {stats.totalClinics > 0 ? (stats.totalPatients / stats.totalClinics).toFixed(1) : 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Controls per Clinic</p>
                    <p className="text-2xl font-bold">
                      {stats.totalClinics > 0 ? (stats.totalControls / stats.totalClinics).toFixed(1) : 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Revenue per Clinic</p>
                    <p className="text-2xl font-bold">
                      ${stats.totalClinics > 0 ? (stats.totalRevenue / stats.totalClinics).toFixed(2) : 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Control Cost</p>
                    <p className="text-2xl font-bold">
                      ${stats.totalControls > 0 ? (stats.totalRevenue / stats.totalControls).toFixed(2) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Clinics</span>
                    <span className="font-semibold">{stats.totalClinics}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Records</span>
                    <span className="font-semibold">{stats.totalPatients}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheduled Controls</span>
                    <span className="font-semibold">{stats.totalControls}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "100%" }}></div>
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
