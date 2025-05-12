"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "@/lib/notification-context"

export default function NotificationCenter() {
  const { notifications, clearNotification, clearAllNotifications } = useNotification()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      notifications.forEach((notification) => {
        if (!notification.read) {
          clearNotification({ ...notification, read: true })
        }
      })
      setUnreadCount(0)
    }
  }

  return (
    <div className="relative z-50">
      {/* Notification Bell */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full bg-background border border-jade-500/30 hover:bg-jade-900/20 transition-all duration-300 text-jade-400"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-background border border-jade-500/30 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-3 border-b border-jade-500/30 flex justify-between items-center">
              <h3 className="font-medium text-jade-400">Notifications</h3>
              <button onClick={() => clearAllNotifications()} className="text-xs text-jade-400 hover:text-jade-300">
                Clear all
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Info className="w-5 h-5 mx-auto mb-2" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-jade-500/20 hover:bg-jade-900/20 relative ${
                      !notification.read ? "bg-jade-900/10" : ""
                    }`}
                  >
                    <button
                      onClick={() => clearNotification(notification)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
