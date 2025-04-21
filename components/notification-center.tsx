"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Info, AlertCircle, CheckCircle } from "lucide-react"
import { useNotification, type NotificationType } from "@/lib/notification-context"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export default function NotificationCenter() {
  const { notifications, removeNotification, markAllAsRead, unreadCount } = useNotification()
  const [isOpen, setIsOpen] = useState(false)

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".notification-center") && !target.closest(".notification-trigger")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      markAllAsRead()
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "info":
        return "border-blue-500/20 bg-blue-500/10"
      case "success":
        return "border-primary/20 bg-primary/10"
      case "warning":
        return "border-amber-500/20 bg-amber-500/10"
      case "error":
        return "border-red-500/20 bg-red-500/10"
    }
  }

  return (
    <div className="relative z-50">
      {/* Notification Bell */}
      <button
        className="notification-trigger relative p-2 text-white/70 hover:text-white hover:bg-primary/10 rounded-lg transition-all duration-300"
        onClick={toggleNotifications}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-center absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto bg-black border border-primary/20 rounded-lg shadow-lg glass">
          <div className="p-3 border-b border-primary/20 flex justify-between items-center sticky top-0 bg-black z-10">
            <h3 className="font-medium text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button className="text-white/70 hover:text-white text-xs flex items-center" onClick={markAllAsRead}>
                  <Check className="h-3 w-3 mr-1" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-primary/10">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-white/50 text-sm">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 relative hover:bg-primary/5 transition-colors",
                    !notification.read && "bg-primary/10",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-1 p-1 rounded-full border", getNotificationColor(notification.type))}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                      <p className="text-white/70 text-xs mt-1 break-words">{notification.message}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      className="text-white/50 hover:text-white"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
