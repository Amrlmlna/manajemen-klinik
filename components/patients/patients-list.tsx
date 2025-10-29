"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Database } from "@/types/supabase"

type Patient = Database["public"]["Tables"]["patients"]["Row"]

interface PatientsListProps {
  patients: Patient[]
}

export function PatientsList({ patients }: PatientsListProps) {
  if (patients.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No patients found</p>
        <Link href="/patients/new">
          <Button>Add Your First Patient</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Date of Birth</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-t hover:bg-muted/50">
              <td className="px-6 py-4">
                <span className="font-medium">
                  {patient.first_name} {patient.last_name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{patient.email || "-"}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{patient.phone || "-"}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4">
                <Link href={`/patients/${patient.id}`}>
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
