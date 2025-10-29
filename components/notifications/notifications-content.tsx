"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotificationsContentProps {
  notifications: any[]
}

const notificationIcons: Record<string, string> = {
  control_reminder: "🔔",
  control_completed: "✅",
  schedule_created: "📅",
  schedule_updated: "📝",
}

const notificationColors: Record<string, string> = {
  control_reminder: "bg-blue-50 border-blue-200",
  control_completed: "bg-green-50 border-green-200",
  schedule_created: "bg-purple-50 border-purple-200",
  schedule_updated: "bg-yellow-50 border-yellow-200",
}

export function NotificationsContent({ notifications }: NotificationsContentProps) {
  const [notificationsList, setNotificationsList] = useState(notifications)
  const router = useRouter()

  const handleMarkAsRead = async (notificationId: string) => {
    const supabase = createClient()

    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      setNotificationsList(notificationsList.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    const supabase = createClient()

    try {
      await supabase.from("notifications").delete().eq("id", notificationId)

      setNotificationsList(notificationsList.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const supabase = createClient()

    try {
      const unreadIds = notificationsList.filter((n) => !n.is_read).map((n) => n.id)

      if (unreadIds.length > 0) {
        await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds)

        setNotificationsList(notificationsList.map((n) => ({ ...n, is_read: true })))
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const unreadCount = notificationsList.filter((n) => !n.is_read).length

  if (notificationsList.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No notifications yet</p>
        <p className="text-sm text-muted-foreground">
          You'll receive notifications when controls are scheduled or completed
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium">
            You have <span className="font-bold">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
          <Button size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 ${notificationColors[notification.notification_type] || "bg-gray-50 border-gray-200"} ${!notification.is_read ? "border-l-4" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{notificationIcons[notification.notification_type] || "📢"}</span>
                  <p className="font-semibold capitalize">{notification.notification_type.replace(/_/g, " ")}</p>
                  {!notification.is_read && <Badge className="bg-blue-600">New</Badge>}
                </div>
                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {!notification.is_read && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notification.id)}>
                    Mark as read
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(notification.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
