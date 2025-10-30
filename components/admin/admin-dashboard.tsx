"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AdminDashboardProps {
  stats: {
    totalClinics: number
    totalPatients: number
    totalControls: number
    totalRevenue: number
  }
  clinics: any[] // Will represent users in personal clinic context
}

export function AdminDashboard({ stats, clinics: users }: AdminDashboardProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("admin")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateUser = async () => {
    if (!email) {
      setError("Email is required")
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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      // Reset form on success
      setEmail("")
      alert(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mobile-friendly stats cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Patient records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalControls}</div>
            <p className="text-xs text-muted-foreground mt-1">Medical controls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Clinic revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clinic Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management with mobile-optimized tabs */}
      <Tabs defaultValue="clinics" className="w-full">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="clinics" className="flex-1 min-w-[120px]">Staff Management</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 min-w-[120px]">Clinic Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Invite New Staff Member</h3>
                <div className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  New staff members will receive an email to set up their account
                </p>
              </div>

              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No staff members yet</p>
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name/Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
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
                <CardTitle>Clinic Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Patients</p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Controls</p>
                    <p className="text-2xl font-bold">{stats.totalControls}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Control Value</p>
                    <p className="text-2xl font-bold">
                      ${stats.totalControls > 0 ? (stats.totalRevenue / stats.totalControls).toFixed(2) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinic Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staff Members</span>
                    <span className="font-semibold">{users.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
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