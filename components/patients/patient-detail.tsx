"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/types/supabase"

type Patient = Database["public"]["Tables"]["patients"]["Row"]

interface PatientDetailProps {
  patient: Patient
}

export function PatientDetail({ patient }: PatientDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
          <p className="text-muted-foreground">ID: {patient.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${patient.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">First Name</p>
                  <p className="font-medium">{patient.first_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Name</p>
                  <p className="font-medium">{patient.last_name}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone || "-"}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              {patient.medical_history && (
                <div>
                  <p className="text-sm text-muted-foreground">Medical History</p>
                  <p className="font-medium whitespace-pre-wrap">{patient.medical_history}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Medical Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No controls scheduled yet</p>
              <Link href={`/controls/new?patient=${patient.id}`}>
                <Button className="mt-4">Schedule Control</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recurring schedules yet</p>
              <Link href={`/schedules/new?patient=${patient.id}`}>
                <Button className="mt-4">Create Schedule</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showDeleteConfirm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Delete Patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Are you sure you want to delete this patient? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  // Delete action will be implemented
                  setShowDeleteConfirm(false)
                }}
              >
                Confirm Delete
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
