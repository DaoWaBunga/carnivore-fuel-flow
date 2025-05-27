
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Activity, Heart, Utensils } from "lucide-react";
import { MealLogger } from "@/components/MealLogger";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { HealthTracker } from "@/components/HealthTracker";
import { NutritionSummary } from "@/components/NutritionSummary";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Header */}
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
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
              <Plus className="h-4 w-4 mr-2" />
              Quick Log
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <p className="text-gray-600">Fitness tracking features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
