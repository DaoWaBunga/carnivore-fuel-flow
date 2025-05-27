
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Beef, Plus, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, NutritionEntry } from "@/hooks/useSupabaseData";

export const NutritionSummary = () => {
  const [nutrients, setNutrients] = useState<NutritionEntry[]>([]);
  const [newNutrient, setNewNutrient] = useState({ name: "", amount: "", unit: "g" });
  const [waterIntake, setWaterIntake] = useState(0);
  const [newWater, setNewWater] = useState("");
  const { toast } = useToast();
  
  const {
    loading,
    addWaterEntry,
    getTodaysWaterIntake,
    addNutritionEntry,
    getTodaysNutritionEntries
  } = useSupabaseData();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [waterData, nutritionData] = await Promise.all([
          getTodaysWaterIntake(),
          getTodaysNutritionEntries()
        ]);
        
        setWaterIntake(waterData);
        setNutrients(nutritionData);
      } catch (error) {
        console.error('Error loading nutrition data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load your nutrition data",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [getTodaysWaterIntake, getTodaysNutritionEntries, toast]);

  const addNutrientEntry = async () => {
    if (!newNutrient.name || !newNutrient.amount) {
      toast({
        title: "Nutrient Information Required",
        description: "Please enter nutrient name and amount",
        variant: "destructive"
      });
      return;
    }

    const result = await addNutritionEntry(
      newNutrient.name,
      parseFloat(newNutrient.amount),
      newNutrient.unit
    );

    if (result) {
      setNutrients(prev => [result, ...prev]);
      setNewNutrient({ name: "", amount: "", unit: "g" });
      
      toast({
        title: "Nutrient Logged! 💊",
        description: `${newNutrient.amount}${newNutrient.unit} of ${newNutrient.name} added`
      });
    }
  };

  const addWater = async () => {
    if (!newWater) {
      toast({
        title: "Water Amount Required",
        description: "Please enter water amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newWater);
    const result = await addWaterEntry(amount);
    
    if (result) {
      setWaterIntake(result.amount);
      setNewWater("");
      
      toast({
        title: "Water Logged! 💧",
        description: `${newWater} oz added to today's intake`
      });
    }
  };

  // Key carnivore nutrients with recommended daily values
  const keyNutrients = [
    { name: "Protein", daily: 120, unit: "g", color: "bg-red-500" },
    { name: "Fat", daily: 100, unit: "g", color: "bg-orange-500" },
    { name: "Vitamin B12", daily: 2.4, unit: "mcg", color: "bg-blue-500" },
    { name: "Iron", daily: 18, unit: "mg", color: "bg-green-500" },
    { name: "Zinc", daily: 11, unit: "mg", color: "bg-purple-500" },
    { name: "Vitamin D", daily: 600, unit: "IU", color: "bg-yellow-500" }
  ];

  const getTodaysNutrients = (nutrientName: string) => {
    return nutrients
      .filter(n => n.name.toLowerCase() === nutrientName.toLowerCase())
      .reduce((sum, n) => sum + n.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Daily Nutrition Overview */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Beef className="h-5 w-5" />
            Daily Nutrition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyNutrients.map((nutrient) => {
            const current = getTodaysNutrients(nutrient.name);
            const percentage = Math.min((current / nutrient.daily) * 100, 100);
            
            return (
              <div key={nutrient.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{nutrient.name}</span>
                  <span className="text-gray-600">
                    {current.toFixed(1)} / {nutrient.daily} {nutrient.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add Custom Nutrients */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Log Nutrients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nutrientName">Nutrient</Label>
              <Input
                id="nutrientName"
                placeholder="e.g., Vitamin B12, Iron"
                value={newNutrient.name}
                onChange={(e) => setNewNutrient({ ...newNutrient, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nutrientAmount">Amount</Label>
              <Input
                id="nutrientAmount"
                type="number"
                placeholder="e.g., 100"
                value={newNutrient.amount}
                onChange={(e) => setNewNutrient({ ...newNutrient, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nutrientUnit">Unit</Label>
              <select
                id="nutrientUnit"
                value={newNutrient.unit}
                onChange={(e) => setNewNutrient({ ...newNutrient, unit: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="g">g</option>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="IU">IU</option>
              </select>
            </div>
          </div>
          
          <Button 
            onClick={addNutrientEntry} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Nutrient
          </Button>
        </CardContent>
      </Card>

      {/* Water Intake */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Water Intake
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">{waterIntake}</div>
            <div className="text-sm text-gray-600">oz consumed today</div>
            <div className="text-xs text-gray-500 mt-1">Goal: 64 oz</div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter water (oz)"
              value={newWater}
              onChange={(e) => setNewWater(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={addWater} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Water
            </Button>
          </div>
          
          <Progress value={Math.min((waterIntake / 64) * 100, 100)} className="h-3" />
        </CardContent>
      </Card>

      {/* Recent Nutrient Entries */}
      {nutrients.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-800">Recent Nutrient Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {nutrients.slice(0, 10).map((nutrient) => (
                <div key={nutrient.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{nutrient.name}</span>
                  <span className="text-gray-600">
                    {nutrient.amount} {nutrient.unit}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(nutrient.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
