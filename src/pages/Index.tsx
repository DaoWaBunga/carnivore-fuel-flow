import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, Info, Heart, Utensils, Users, LogOut } from "lucide-react";
import { MealLogger } from "@/components/MealLogger";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { HealthTracker } from "@/components/HealthTracker";
import { NutritionSummary } from "@/components/NutritionSummary";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileTabs } from "@/components/MobileTabs";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { ProfileEditor } from "@/components/ProfileEditor";
import { CommunityFeed } from "@/components/CommunityFeed";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quickLog, setQuickLog] = useState({ meal: "", weight: "", steps: "" });
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const { profile, updateDisplayName } = useUserProfile();

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

  const getDisplayText = () => {
    if (profile?.display_name) {
      return profile.display_name;
    }
    return user?.email || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader 
          onQuickLogOpen={() => setIsQuickLogOpen(true)} 
          profile={profile}
          onDisplayNameUpdate={updateDisplayName}
        />
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
                    <div className="flex items-center space-x-1">
                      <p className="font-medium">{getDisplayText()}</p>
                      <ProfileEditor 
                        displayName={profile?.display_name || null}
                        onDisplayNameUpdate={updateDisplayName}
                      />
                    </div>
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
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
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
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Info
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

          <TabsContent value="community">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="info">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Carnivore Diet: A Basic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  The Carnivore Diet is a unique way of eating that focuses exclusively on animal-based foods meat, fish, eggs, and sometimes dairy while completely eliminating all plant-based foods. Followers eat foods like beef, pork, chicken, seafood, organ meats, eggs, animal fats, and, if tolerated, some cheese or heavy cream. Fruits, vegetables, grains, legumes, nuts, seeds, and all processed foods are excluded.
                </p>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">Why Do People Try the Carnivore Diet?</h3>
                <p className="text-gray-700 mb-4">
                  Advocates believe that an all-animal diet can provide complete nutrition, support weight loss, reduce inflammation, stabilize blood sugar, improve digestion, and even help with autoimmune or mood issues. Many people adopt the diet as a strict "elimination diet" to identify food sensitivities, while others choose it for simplicity and satiety.
                </p>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">Types of Carnivore Diets</h3>
                <ul className="text-gray-700 mb-4 space-y-2">
                  <li><strong>Strict Carnivore:</strong> Only meat, fish, eggs, animal fats, and water.</li>
                  <li><strong>Nose-to-Tail:</strong> Includes organ meats and collagen-rich parts for broader nutrition.</li>
                  <li><strong>Lion Diet:</strong> The most restrictive, typically only ruminant meat (like beef or lamb), salt, and water.</li>
                </ul>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">What Do You Eat?</h3>
                <ul className="text-gray-700 mb-4 space-y-2">
                  <li><strong>Animal Proteins:</strong> Beef, pork, chicken, turkey, lamb, wild game, fish, seafood.</li>
                  <li><strong>Eggs:</strong> Whole eggs, any style.</li>
                  <li><strong>Organ Meats:</strong> Liver, kidney, heart, bone marrow, etc. (especially encouraged for nutrients).</li>
                  <li><strong>Animal Fats:</strong> Butter, ghee, tallow, lard, dripping.</li>
                  <li><strong>Dairy (optional):</strong> Cheese, heavy cream, or yogurt if tolerated.</li>
                </ul>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">Typical Benefits Reported</h3>
                <ul className="text-gray-700 mb-4 space-y-1">
                  <li>• Weight loss and reduced cravings</li>
                  <li>• More stable energy and improved mental clarity</li>
                  <li>• Relief from some digestive, inflammatory, or autoimmune symptoms</li>
                  <li>• Simpler meal planning and improved satiety</li>
                </ul>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">Points to Consider</h3>
                <ul className="text-gray-700 mb-4 space-y-1">
                  <li>• The diet is very low in carbohydrates and completely excludes fiber.</li>
                  <li>• Some nutrients commonly found in plants (like vitamin C and magnesium) are low and may require careful planning or supplements.</li>
                  <li>• Blood cholesterol can increase for some people, so regular health checkups are recommended.</li>
                  <li>• It's important to include a variety of animal foods (especially organ meats) for optimal nutrition.</li>
                </ul>

                <h3 className="text-lg font-semibold text-red-700 mt-6 mb-3">Who Might Try Carnivore?</h3>
                <p className="text-gray-700 mb-4">
                  People often try the carnivore diet after not getting results from other approaches, especially for weight loss plateaus, gut issues, autoimmune conditions, or simply to see how they feel on a simple, high-protein, high-fat diet. It's popular among both health experimenters and those looking for a no-fuss way of eating.
                </p>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-6">
                  <p className="text-orange-800">
                    <strong>Note:</strong> The Carnivore Diet is highly restrictive and isn't for everyone. Consult with a healthcare provider before starting any major dietary change, especially if you have pre-existing health conditions.
                  </p>
                </div>
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
