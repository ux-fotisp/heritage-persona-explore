import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Star,
  Users,
  MapPin,
  Settings,
  HelpCircle,
  User,
  Heart,
  Calendar,
  X,
  Shield,
  Plus,
} from "lucide-react";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: FileText, label: "Blog Posts", path: "/blog", description: "Latest travel stories and guides" },
  { icon: Heart, label: "Favorites", path: "/favorites", description: "Your saved heritage sites" },
  { icon: Plus, label: "Your Listings", path: "/your-listings", description: "Manage your heritage listings" },
  { icon: HelpCircle, label: "About This App", path: "/about", description: "Learn about our research project" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy", description: "How we protect your data" },
  { icon: HelpCircle, label: "FAQ", path: "/faq", description: "Frequently asked questions" },
];

const secondaryItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="left">
      <DrawerContent className="h-[90vh] max-w-sm">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-xl font-bold">Menu</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 pb-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleNavigation(item.path)}
              >
                <div className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-3">
              Settings
            </h3>
            {secondaryItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}