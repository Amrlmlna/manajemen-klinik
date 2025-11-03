"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const [message, setMessage] = useState("Processing your invitation...")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const handleMagicLink = async () => {
      const supabase = createClient()
      const email = searchParams.get("email")
      const role = searchParams.get("role") as "admin" | "super_admin" || "admin"
      
      if (!email) {
        setError("Invalid invitation link")
        setMessage("Invalid invitation link")
        return
      }

      try {
        // Verify the magic link and complete the sign-in
        const { error: authError } = await supabase.auth.verifyOtp({
          email,
          token: searchParams.get("token") || "",
          type: "magiclink"
        })

        if (authError) {
          console.error("Error verifying magic link:", authError)
          setError("Invalid or expired invitation link")
          setMessage("Invalid or expired invitation link")
          return
        }

        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setError("Authentication failed")
          setMessage("Authentication failed")
          return
        }

        // Create/update the user profile with the assigned role
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            role: role,
            clinic_name: user.email?.split('@')[0], // Use part of email as default clinic name
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          setError("Error setting up your account")
          setMessage("Error setting up your account")
          return
        }

        setMessage("Account created successfully! Redirecting...")
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } catch (err) {
        console.error("Error handling magic link:", err)
        setError("An error occurred while processing your invitation")
        setMessage("An error occurred while processing your invitation")
      }
    }

    handleMagicLink()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Invitation Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {message}
              </p>
              <a href="/auth/login">
                <Button className="w-full">Back to Login</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Processing Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {message}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}