
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [todaysMeals, setTodaysMeals] = useState<any[]>([]);
  const { toast } = useToast();

  const filteredFoods = CARNIVORE_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMeal = () => {
    if (!selectedFood || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please select a food and enter quantity",
        variant: "destructive"
      });
      return;
    }

    const food = CARNIVORE_FOODS.find(f => f.name === selectedFood);
    if (!food) return;

    const quantityNum = parseFloat(quantity);
    const meal = {
      id: Date.now(),
      ...food,
      quantity: quantityNum,
      totalProtein: (food.protein * quantityNum / 100).toFixed(1),
      totalFat: (food.fat * quantityNum / 100).toFixed(1),
      totalCarbs: (food.carbs * quantityNum / 100).toFixed(1),
      time: new Date().toLocaleTimeString()
    };

    setTodaysMeals([...todaysMeals, meal]);
    setSelectedFood("");
    setQuantity("");
    
    toast({
      title: "Meal Added! 🥩",
      description: `${quantityNum}g of ${food.name} logged successfully`
    });
  };

  const totalMacros = todaysMeals.reduce(
    (acc, meal) => ({
      protein: acc.protein + parseFloat(meal.totalProtein),
      fat: acc.fat + parseFloat(meal.totalFat),
      carbs: acc.carbs + parseFloat(meal.totalCarbs)
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
        <CardContent className="space-y-4">
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
            <Button onClick={addMeal} className="bg-red-600 hover:bg-red-700 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
            <Button variant="outline" className="border-red-200">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
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
                    <div className="font-medium">{meal.quantity}g {meal.name}</div>
                    <div className="text-sm text-gray-600">{meal.time}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>P: {meal.totalProtein}g</div>
                    <div>F: {meal.totalFat}g</div>
                    {parseFloat(meal.totalCarbs) > 0 && <div>C: {meal.totalCarbs}g</div>}
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
