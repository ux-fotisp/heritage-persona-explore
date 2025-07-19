import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  MapPin,
  Calendar,
  Heart,
  Users,
  X,
  Trash2,
} from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: "new_site",
    icon: MapPin,
    title: "New Heritage Site Added",
    message: "Ancient Palace Complex has been added to your area",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "event",
    icon: Calendar,
    title: "Cultural Festival Reminder",
    message: "Water Festival starts tomorrow in your saved locations",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "social",
    icon: Users,
    title: "New Group Member",
    message: "Sarah joined your Cultural Heritage Explorers group",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 4,
    type: "favorite",
    icon: Heart,
    title: "Favorite Site Update",
    message: "Ancient Temple Complex has new visitor hours",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    type: "system",
    icon: Bell,
    title: "Profile Completed",
    message: "Your travel persona has been successfully created",
    time: "3 days ago",
    unread: false,
  },
];

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    // TODO: Implement mark all as read functionality
    console.log("Mark all notifications as read");
  };

  const handleDeleteNotification = (id: number) => {
    // TODO: Implement delete notification functionality
    console.log("Delete notification:", id);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DrawerTitle className="text-xl font-bold">Notifications</DrawerTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="px-4 pb-6 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                      notification.unread ? "bg-muted/30" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        notification.unread ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <notification.icon
                        className={`h-4 w-4 ${
                          notification.unread ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4
                          className={`text-sm font-medium ${
                            notification.unread ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                  
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}