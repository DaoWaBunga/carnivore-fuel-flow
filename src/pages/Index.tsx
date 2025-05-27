
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, Activity, Heart, Utensils, LogOut } from "lucide-react";
import { MealLogger } from "@/components/MealLogger";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { HealthTracker } from "@/components/HealthTracker";
import { NutritionSummary } from "@/components/NutritionSummary";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileTabs } from "@/components/MobileTabs";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quickLog, setQuickLog] = useState({ meal: "", weight: "", steps: "" });
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();

  const handleQuickLog = () => {
    const loggedItems = [];
    if (quickLog.meal) loggedItems.push("meal");
    if (quickLog.weight) loggedItems.push("weight");
    if (quickLog.steps) loggedItems.push("steps");
    
    if (loggedItems.length === 0) {
      toast({
        title: "Nothing to Log",
        description: "Please enter at least one item to log",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Quick Log Successful! ⚡",
      description: `Logged: ${loggedItems.join(", ")}`
    });
    
    setQuickLog({ meal: "", weight: "", steps: "" });
    setIsQuickLogOpen(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader onQuickLogOpen={() => setIsQuickLogOpen(true)} />
      ) : (
        // Desktop Header
        <header className="bg-gradient-to-r from-red-800 via-red-700 to-orange-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Utensils className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">CarniTrack</h1>
                  <p className="text-red-100 text-sm">Your Carnivore Lifestyle Companion</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="text-right">
                    <p className="text-sm text-red-100">Welcome back!</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                )}
                
                <Dialog open={isQuickLogOpen} onOpenChange={setIsQuickLogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Quick Log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quickMeal" className="text-right">
                          Meal
                        </Label>
                        <Input
                          id="quickMeal"
                          placeholder="e.g., 200g ribeye"
                          className="col-span-3"
                          value={quickLog.meal}
                          onChange={(e) => setQuickLog({ ...quickLog, meal: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quickWeight" className="text-right">
                          Weight
                        </Label>
                        <Input
                          id="quickWeight"
                          placeholder="e.g., 175 lbs"
                          className="col-span-3"
                          value={quickLog.weight}
                          onChange={(e) => setQuickLog({ ...quickLog, weight: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quickSteps" className="text-right">
                          Steps
                        </Label>
                        <Input
                          id="quickSteps"
                          placeholder="e.g., 8000 steps"
                          className="col-span-3"
                          value={quickLog.steps}
                          onChange={(e) => setQuickLog({ ...quickLog, steps: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleQuickLog} className="w-full bg-red-600 hover:bg-red-700">
                      Log All Items
                    </Button>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleSignOut}
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 border-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Quick Log Dialog for Mobile */}
      <Dialog open={isQuickLogOpen} onOpenChange={setIsQuickLogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Log</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quickMeal">Meal</Label>
              <Input
                id="quickMeal"
                placeholder="e.g., 200g ribeye"
                value={quickLog.meal}
                onChange={(e) => setQuickLog({ ...quickLog, meal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quickWeight">Weight</Label>
              <Input
                id="quickWeight"
                placeholder="e.g., 175 lbs"
                value={quickLog.weight}
                onChange={(e) => setQuickLog({ ...quickLog, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quickSteps">Steps</Label>
              <Input
                id="quickSteps"
                placeholder="e.g., 8000 steps"
                value={quickLog.steps}
                onChange={(e) => setQuickLog({ ...quickLog, steps: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleQuickLog} className="w-full bg-red-600 hover:bg-red-700">
            Log All Items
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <ResponsiveLayout className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs */}
          {!isMobile && (
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="meals" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Meals
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Health
              </TabsTrigger>
              <TabsTrigger value="fitness" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Fitness
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProgressDashboard />
              </div>
              <div>
                <NutritionSummary />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meals">
            <MealLogger />
          </TabsContent>

          <TabsContent value="health">
            <HealthTracker />
          </TabsContent>

          <TabsContent value="fitness">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-red-800">Fitness Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced fitness tracking features coming soon! For now, you can log steps in the Health tab.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ResponsiveLayout>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default Index;
