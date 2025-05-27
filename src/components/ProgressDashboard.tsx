
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Weight, Target, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeightEntry {
  id: number;
  weight: number;
  date: string;
}

interface Goal {
  id: number;
  type: string;
  target: number;
  current: number;
}

export const ProgressDashboard = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ type: "", target: "" });
  const { toast } = useToast();

  const addWeightEntry = () => {
    if (!newWeight) {
      toast({
        title: "Weight Required",
        description: "Please enter your weight",
        variant: "destructive"
      });
      return;
    }

    const entry: WeightEntry = {
      id: Date.now(),
      weight: parseFloat(newWeight),
      date: new Date().toLocaleDateString()
    };

    setWeightEntries([...weightEntries, entry]);
    setNewWeight("");
    
    toast({
      title: "Weight Logged! ⚖️",
      description: `${newWeight} lbs recorded for today`
    });
  };

  const addGoal = () => {
    if (!newGoal.type || !newGoal.target) {
      toast({
        title: "Goal Information Required",
        description: "Please enter goal type and target",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      type: newGoal.type,
      target: parseFloat(newGoal.target),
      current: 0
    };

    setGoals([...goals, goal]);
    setNewGoal({ type: "", target: "" });
    
    toast({
      title: "Goal Added! 🎯",
      description: `New ${newGoal.type} goal set`
    });
  };

  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  const weightChange = weightEntries.length > 1 ? 
    weightEntries[weightEntries.length - 1].weight - weightEntries[weightEntries.length - 2].weight : 0;

  return (
    <div className="space-y-6">
      {/* Weight Tracking */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Weight className="h-5 w-5" />
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{currentWeight || "---"}</div>
              <div className="text-sm text-gray-600">Current Weight (lbs)</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">
                {weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1) || "---"}
              </div>
              <div className="text-sm text-gray-600">Change (lbs)</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{weightEntries.length}</div>
              <div className="text-sm text-gray-600">Entries Logged</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter weight (lbs)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addWeightEntry} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Log Weight
            </Button>
          </div>

          {weightEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Recent Entries:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {weightEntries.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{entry.date}</span>
                    <span className="font-medium">{entry.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Tracking */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals & Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalType">Goal Type</Label>
              <Input
                id="goalType"
                placeholder="e.g., Target Weight, Body Fat %"
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="goalTarget">Target Value</Label>
              <Input
                id="goalTarget"
                type="number"
                placeholder="e.g., 175"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
            </div>
          </div>
          
          <Button onClick={addGoal} className="w-full bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>

          {goals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Active Goals:</h4>
              {goals.map((goal) => (
                <div key={goal.id} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.type}</span>
                    <span className="text-red-700 font-bold">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{weightEntries.length}</div>
              <div className="text-red-100">Days Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{goals.length}</div>
              <div className="text-red-100">Active Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {weightEntries.length > 0 ? Math.abs(weightChange).toFixed(1) : "0"}
              </div>
              <div className="text-red-100">Recent Change (lbs)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
