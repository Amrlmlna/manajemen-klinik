"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    // Get initial unread count
    const fetchUnreadCount = async () => {
      // For now, get all notifications (in a real implementation, 
      // this would be filtered by user's clinic or related entities)
      const { data } = await supabase
        .from("notifications")
        .select("id")
        .eq("is_read", false)

      setUnreadCount(data?.length || 0)
    }

    fetchUnreadCount()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchUnreadCount()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
