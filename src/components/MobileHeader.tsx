
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Utensils, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MobileHeaderProps {
  onQuickLogOpen: () => void;
}

export const MobileHeader = ({ onQuickLogOpen }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time! 👋",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-orange-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CarniTrack</h1>
              <p className="text-red-100 text-xs">Your Carnivore Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={onQuickLogOpen}
              variant="secondary" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 border-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 border-0"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 py-4">
                  <div className="text-center pb-4 border-b">
                    {user && (
                      <div>
                        <p className="text-sm text-gray-600">Welcome back!</p>
                        <p className="font-medium truncate">{user.email}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
