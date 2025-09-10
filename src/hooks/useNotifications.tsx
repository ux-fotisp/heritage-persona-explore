import { useState, useEffect } from "react";
import { Bell, MapPin, Calendar } from "lucide-react";

export type NotificationItem = {
  id: string;
  type: string;
  icon: any;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const staticNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "new_site",
    icon: MapPin,
    title: "New Heritage Site Added",
    message: "Ancient Palace Complex has been added to your area",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "n2",
    type: "event",
    icon: Calendar,
    title: "Cultural Festival Reminder",
    message: "Water Festival starts tomorrow in your saved locations",
    time: "5 hours ago",
    unread: true,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = () => {
    const reminders = JSON.parse(localStorage.getItem("ueqsReminders") || "[]");
    const mapped: NotificationItem[] = reminders.map((r: any) => ({
      id: r.id,
      type: "ueqs",
      icon: Bell,
      title: r.title,
      message: r.message,
      time: r.when,
      unread: true,
    }));
    setNotifications([...mapped, ...staticNotifications]);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    loadNotifications,
    markAllRead,
    deleteNotification,
  };
}