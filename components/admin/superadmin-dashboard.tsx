"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Users, Building2, Calendar, DollarSign } from "lucide-react"

interface SuperAdminDashboardProps {
  stats: {
    totalClinics: number
    totalUsers: number
    totalPatients: number
    totalControls: number
    totalRevenue: number
  }
  clinics: any[] // List of all clinics
  users: any[] // List of all users
}

export function SuperAdminDashboard({ stats, clinics, users }: SuperAdminDashboardProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("admin")
  const [clinicName, setClinicName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateUser = async () => {
    if (!email || !clinicName) {
      setError("Email and clinic name are required")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          clinicName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      // Reset form on success
      setEmail("")
      setClinicName("")
      alert(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mobile-friendly stats cards grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clinics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClinics}</div>
            <p className="text-xs text-muted-foreground mt-1">Across system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">System-wide</p>
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
            <p className="text-xs text-muted-foreground mt-1">Across all clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">System-wide</p>
          </CardContent>
        </Card>
      </div>

      {/* User & Clinic Management with mobile-optimized tabs */}
      <Tabs defaultValue="clinics" className="w-full">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="clinics" className="flex-1 min-w-[120px]">Clinic Management</TabsTrigger>
          <TabsTrigger value="users" className="flex-1 min-w-[120px]">User Management</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 min-w-[120px]">System Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics">
          <Card>
            <CardHeader>
              <CardTitle>All Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              {clinics.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No clinics registered yet</p>
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Clinic Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Owner</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Users</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Patients</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Controls</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinics.map((clinic) => (
                        <tr key={clinic.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-4 font-medium">{clinic.clinic_name}</td>
                          <td className="px-4 py-4">{clinic.email || 'N/A'}</td>
                          <td className="px-4 py-4">{clinic.user_count || 0}</td>
                          <td className="px-4 py-4">{clinic.patient_count || 0}</td>
                          <td className="px-4 py-4">{clinic.control_count || 0}</td>
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Invite New User</h3>
                <div className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                      id="clinicName"
                      type="text"
                      placeholder="Clinic Name"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button onClick={handleCreateUser} disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? "Sending Invitation..." : "Send Invitation"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  New users will receive an email to set up their account
                </p>
              </div>

              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users registered yet</p>
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name/Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Clinic</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-4 font-medium">
                            {user.clinic_name || user.email}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className="capitalize">{user.role}</Badge>
                          </td>
                          <td className="px-4 py-4">{user.clinic_name}</td>
                          <td className="px-4 py-4 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
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

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Clinics</p>
                    <p className="text-2xl font-bold">{stats.totalClinics}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Controls</p>
                    <p className="text-2xl font-bold">{stats.totalControls}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Revenue per Clinic</p>
                    <p className="text-2xl font-bold">
                      ${stats.totalClinics > 0 ? (stats.totalRevenue / stats.totalClinics).toFixed(2) : 0}
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
                    <span className="text-sm">Clinic Registration</span>
                    <span className="font-semibold">{stats.totalClinics}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, stats.totalClinics * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Growth</span>
                    <span className="font-semibold">{stats.totalUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, stats.totalUsers * 2)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Records</span>
                    <span className="font-semibold">{stats.totalPatients}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, stats.totalPatients * 0.5)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Control Management</span>
                    <span className="font-semibold">{stats.totalControls}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, stats.totalControls * 0.3)}%` }}
                    ></div>
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