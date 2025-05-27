
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, MealEntry } from "@/hooks/useSupabaseData";

export const MealLogger = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [newMeal, setNewMeal] = useState({
    food_name: "",
    quantity: "",
    unit: "g",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    meal_time: ""
  });

  const { toast } = useToast();
  const { loading, addMeal, getTodaysMeals } = useSupabaseData();

  // Load today's meals on component mount
  useEffect(() => {
    const loadTodaysMeals = async () => {
      try {
        const todaysMeals = await getTodaysMeals();
        setMeals(todaysMeals);
      } catch (error) {
        console.error('Error loading meals:', error);
        toast({
          title: "Error Loading Meals",
          description: "Failed to load today's meals",
          variant: "destructive"
        });
      }
    };

    loadTodaysMeals();
  }, [getTodaysMeals, toast]);

  const handleAddMeal = async () => {
    if (!newMeal.food_name || !newMeal.quantity) {
      toast({
        title: "Missing Information",
        description: "Please enter food name and quantity",
        variant: "destructive"
      });
      return;
    }

    const mealData = {
      food_name: newMeal.food_name,
      quantity: parseFloat(newMeal.quantity),
      unit: newMeal.unit,
      calories: newMeal.calories ? parseFloat(newMeal.calories) : undefined,
      protein: newMeal.protein ? parseFloat(newMeal.protein) : undefined,
      fat: newMeal.fat ? parseFloat(newMeal.fat) : undefined,
      carbs: newMeal.carbs ? parseFloat(newMeal.carbs) : undefined,
      meal_time: newMeal.meal_time || undefined,
      date: new Date().toISOString().split('T')[0]
    };

    const result = await addMeal(mealData);
    
    if (result) {
      setMeals(prev => [result, ...prev]);
      setNewMeal({
        food_name: "",
        quantity: "",
        unit: "g",
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
        meal_time: ""
      });
    }
  };

  // Calculate daily totals
  const dailyTotals = meals.reduce((totals, meal) => ({
    calories: totals.calories + (meal.calories || 0),
    protein: totals.protein + (meal.protein || 0),
    fat: totals.fat + (meal.fat || 0),
    carbs: totals.carbs + (meal.carbs || 0)
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  return (
    <div className="space-y-6">
      {/* Add New Meal */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Your Meal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foodName">Food Name</Label>
              <Input
                id="foodName"
                placeholder="e.g., Ribeye Steak"
                value={newMeal.food_name}
                onChange={(e) => setNewMeal({ ...newMeal, food_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="300"
                  value={newMeal.quantity}
                  onChange={(e) => setNewMeal({ ...newMeal, quantity: e.target.value })}
                  className="flex-1"
                />
                <Select value={newMeal.unit} onValueChange={(value) => setNewMeal({ ...newMeal, unit: value })}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="pieces">pcs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="400"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="30"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="25"
                value={newMeal.fat}
                onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="0"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mealTime">Meal Time (Optional)</Label>
            <Select value={newMeal.meal_time} onValueChange={(value) => setNewMeal({ ...newMeal, meal_time: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleAddMeal}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Meal
          </Button>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Today's Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{Math.round(dailyTotals.calories)}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{Math.round(dailyTotals.protein)}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{Math.round(dailyTotals.fat)}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{Math.round(dailyTotals.carbs)}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      {meals.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Today's Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{meal.food_name}</h4>
                      <p className="text-sm text-gray-600">
                        {meal.quantity} {meal.unit}
                        {meal.meal_time && ` • ${meal.meal_time}`}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      {meal.calories && <div>{meal.calories} cal</div>}
                      {meal.protein && <div>{meal.protein}g protein</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
