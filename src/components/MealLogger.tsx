import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Camera } from "lucide-react";
import { useSupabaseData, MealEntry } from "@/hooks/useSupabaseData";

const CARNIVORE_FOODS = [
  { name: "Ribeye Steak", protein: 25, fat: 20, carbs: 0, category: "Beef" },
  { name: "Ground Beef (80/20)", protein: 20, fat: 20, carbs: 0, category: "Beef" },
  { name: "Beef Liver", protein: 20, fat: 4, carbs: 4, category: "Organ Meat" },
  { name: "Salmon Fillet", protein: 25, fat: 14, carbs: 0, category: "Fish" },
  { name: "Chicken Thigh", protein: 18, fat: 14, carbs: 0, category: "Poultry" },
  { name: "Eggs (Large)", protein: 6, fat: 5, carbs: 0.6, category: "Eggs" },
  { name: "Bacon", protein: 12, fat: 42, carbs: 0, category: "Pork" },
  { name: "Bone Broth", protein: 6, fat: 0, carbs: 0, category: "Broth" },
  { name: "Butter", protein: 0.9, fat: 81, carbs: 0.1, category: "Dairy" },
  { name: "Beef Tallow", protein: 0, fat: 100, carbs: 0, category: "Fat" },
];

export const MealLogger = () => {
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([]);
  
  // Manual food entry states
  const [manualFood, setManualFood] = useState({
    name: "",
    protein: "",
    fat: "",
    carbs: "",
    quantity: "",
    category: "Custom"
  });
  
  const { loading, addMeal, getTodaysMeals } = useSupabaseData();

  // Load today's meals on component mount
  useEffect(() => {
    const loadTodaysMeals = async () => {
      const meals = await getTodaysMeals();
      setTodaysMeals(meals);
    };
    
    loadTodaysMeals();
  }, []);

  const filteredFoods = CARNIVORE_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMeal = async () => {
    const food = CARNIVORE_FOODS.find(f => f.name === selectedFood);
    if (!food || !quantity) return;

    const quantityNum = parseFloat(quantity);
    const mealData = {
      food_name: food.name,
      quantity: quantityNum,
      unit: "g",
      protein: food.protein * quantityNum / 100,
      fat: food.fat * quantityNum / 100,
      carbs: food.carbs * quantityNum / 100,
      calories: (food.protein * 4 + food.fat * 9 + food.carbs * 4) * quantityNum / 100,
      meal_time: new Date().toLocaleTimeString(),
      date: new Date().toISOString().split('T')[0]
    };

    const result = await addMeal(mealData);
    if (result) {
      setTodaysMeals(prev => [result, ...prev]);
      setSelectedFood("");
      setQuantity("");
    }
  };

  const handleAddManualMeal = async () => {
    if (!manualFood.name || !manualFood.quantity) return;

    const quantityNum = parseFloat(manualFood.quantity);
    const proteinNum = parseFloat(manualFood.protein) || 0;
    const fatNum = parseFloat(manualFood.fat) || 0;
    const carbsNum = parseFloat(manualFood.carbs) || 0;

    const mealData = {
      food_name: manualFood.name,
      quantity: quantityNum,
      unit: "g",
      protein: proteinNum * quantityNum / 100,
      fat: fatNum * quantityNum / 100,
      carbs: carbsNum * quantityNum / 100,
      calories: (proteinNum * 4 + fatNum * 9 + carbsNum * 4) * quantityNum / 100,
      meal_time: new Date().toLocaleTimeString(),
      date: new Date().toISOString().split('T')[0]
    };

    const result = await addMeal(mealData);
    if (result) {
      setTodaysMeals(prev => [result, ...prev]);
      setManualFood({
        name: "",
        protein: "",
        fat: "",
        carbs: "",
        quantity: "",
        category: "Custom"
      });
    }
  };

  const totalMacros = todaysMeals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.protein || 0),
      fat: acc.fat + (meal.fat || 0),
      carbs: acc.carbs + (meal.carbs || 0)
    }),
    { protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Add Meal Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Your Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="database">Food Database</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search carnivore foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="food">Food Item</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFoods.map((food) => (
                        <SelectItem key={food.name} value={food.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{food.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{food.category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity (grams)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 200"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMeal} 
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
                <Button variant="outline" className="border-red-200">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manualName">Food Name</Label>
                  <Input
                    id="manualName"
                    placeholder="e.g., Wild Venison"
                    value={manualFood.name}
                    onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="manualQuantity">Quantity (grams)</Label>
                  <Input
                    id="manualQuantity"
                    type="number"
                    placeholder="e.g., 200"
                    value={manualFood.quantity}
                    onChange={(e) => setManualFood({ ...manualFood, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="manualProtein">Protein (g per 100g)</Label>
                  <Input
                    id="manualProtein"
                    type="number"
                    placeholder="e.g., 25"
                    value={manualFood.protein}
                    onChange={(e) => setManualFood({ ...manualFood, protein: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="manualFat">Fat (g per 100g)</Label>
                  <Input
                    id="manualFat"
                    type="number"
                    placeholder="e.g., 15"
                    value={manualFood.fat}
                    onChange={(e) => setManualFood({ ...manualFood, fat: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="manualCarbs">Carbs (g per 100g)</Label>
                  <Input
                    id="manualCarbs"
                    type="number"
                    placeholder="e.g., 0"
                    value={manualFood.carbs}
                    onChange={(e) => setManualFood({ ...manualFood, carbs: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddManualMeal} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Meal
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Today's Macros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalMacros.protein.toFixed(1)}g</div>
              <div className="text-red-100">Protein</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalMacros.fat.toFixed(1)}g</div>
              <div className="text-red-100">Fat</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalMacros.carbs.toFixed(1)}g</div>
              <div className="text-red-100">Carbs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      {todaysMeals.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-800">Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysMeals.map((meal) => (
                <div key={meal.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">{meal.quantity}g {meal.food_name}</div>
                    <div className="text-sm text-gray-600">{meal.meal_time}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>P: {(meal.protein || 0).toFixed(1)}g</div>
                    <div>F: {(meal.fat || 0).toFixed(1)}g</div>
                    {(meal.carbs || 0) > 0 && <div>C: {(meal.carbs || 0).toFixed(1)}g</div>}
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
