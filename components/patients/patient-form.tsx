"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Database } from "@/types/supabase"

type Patient = Database["public"]["Tables"]["patients"]["Row"]

interface PatientFormProps {
  patient?: Patient
}

export function PatientForm({ patient }: PatientFormProps) {
  const [firstName, setFirstName] = useState(patient?.first_name || "")
  const [lastName, setLastName] = useState(patient?.last_name || "")
  const [email, setEmail] = useState(patient?.email || "")
  const [phone, setPhone] = useState(patient?.phone || "")
  const [dateOfBirth, setDateOfBirth] = useState(patient?.date_of_birth || "")
  const [medicalHistory, setMedicalHistory] = useState(patient?.medical_history || "")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (patient) {
        const { error } = await supabase
          .from("patients")
          .update({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            date_of_birth: dateOfBirth || null,
            medical_history: medicalHistory || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", patient.id)

        if (error) throw error
        router.push(`/patients/${patient.id}`)
      } else {
        const { error } = await supabase.from("patients").insert({
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          medical_history: medicalHistory || null,
        })

        if (error) throw error
        router.push("/patients")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient ? "Edit Patient" : "Create New Patient"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name *</Label>
              <Input id="first-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name *</Label>
              <Input id="last-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="medical-history">Medical History</Label>
            <Textarea
              id="medical-history"
              placeholder="Enter any relevant medical history..."
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : patient ? "Update Patient" : "Create Patient"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
