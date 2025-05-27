
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const NutritionSummary = () => {
  // Mock data for demonstration
  const nutritionData = {
    protein: { current: 145, target: 150, percentage: 97 },
    fat: { current: 120, target: 130, percentage: 92 },
    organMeats: { thisWeek: 2, target: 3 },
    hydration: { glasses: 6, target: 8 },
    lastOrganMeat: "3 days ago",
    streakDays: 42
  };

  const micronutrients = [
    { name: "Vitamin B12", status: "excellent", level: 95 },
    { name: "Iron", status: "good", level: 85 },
    { name: "Zinc", status: "good", level: 80 },
    { name: "Vitamin D", status: "needs attention", level: 45 },
    { name: "Magnesium", status: "good", level: 75 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-500";
      case "good": return "bg-blue-500";
      case "needs attention": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "needs attention": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Carnivore Streak */}
      <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔥 Carnivore Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{nutritionData.streakDays}</div>
            <div className="text-red-100">days strong!</div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Macros */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Today's Macros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Protein</span>
              <span className="text-sm text-gray-600">
                {nutritionData.protein.current}g / {nutritionData.protein.target}g
              </span>
            </div>
            <Progress value={nutritionData.protein.percentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Fat</span>
              <span className="text-sm text-gray-600">
                {nutritionData.fat.current}g / {nutritionData.fat.target}g
              </span>
            </div>
            <Progress value={nutritionData.fat.percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Organ Meat Tracker */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Organ Meat Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">This week</span>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              {nutritionData.organMeats.thisWeek} / {nutritionData.organMeats.target} servings
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Last organ meat</span>
            <span className="text-sm text-gray-600">{nutritionData.lastOrganMeat}</span>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              💡 Try to include liver, heart, or kidney this week for optimal nutrition!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Micronutrient Status */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Nutrient Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {micronutrients.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(nutrient.status)}
                  <span className="text-sm">{nutrient.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(nutrient.status)}`}
                      style={{ width: `${nutrient.level}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">{nutrient.level}%</span>
                </div>
              </div>
            ))}
          </div>
          
          {micronutrients.some(n => n.status === "needs attention") && (
            <div className="mt-4 bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ Consider adding more variety or supplementation for nutrients marked as "needs attention"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hydration */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Hydration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Water intake</span>
            <span className="text-sm text-gray-600">
              {nutritionData.hydration.glasses} / {nutritionData.hydration.target} glasses
            </span>
          </div>
          <Progress 
            value={(nutritionData.hydration.glasses / nutritionData.hydration.target) * 100} 
            className="h-2" 
          />
          <p className="text-xs text-gray-600 mt-2">
            💧 Don't forget electrolytes! Add a pinch of sea salt to your water.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
