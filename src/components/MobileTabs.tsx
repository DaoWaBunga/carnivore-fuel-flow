
import { Button } from "@/components/ui/button";
import { TrendingUp, Utensils, Heart, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: TrendingUp },
  { id: "meals", label: "Meals", icon: Utensils },
  { id: "health", label: "Health", icon: Heart },
  { id: "info", label: "Info", icon: Info },
];

export const MobileTabs = ({ activeTab, onTabChange }: MobileTabsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center space-y-1 h-auto py-2",
                activeTab === tab.id 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
