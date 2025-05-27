
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Weight, Target, Plus, Activity, Heart, Flame } from "lucide-react";
import { useSupabaseData, WeightEntry, Goal, HealthMetric, ActivityData } from "@/hooks/useSupabaseData";

export const ProgressDashboard = () => {
  const [newWeight, setNewWeight] = useState("");
  const [newGoal, setNewGoal] = useState({ type: "", target: "" });
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [todaysHealth, setTodaysHealth] = useState<HealthMetric | null>(null);
  const [todaysActivity, setTodaysActivity] = useState<ActivityData | null>(null);

  const {
    loading,
    addWeightEntry,
    getWeightEntries,
    addGoal,
    getGoals,
    getTodaysHealthMetrics,
    getTodaysActivity
  } = useSupabaseData();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const [weights, goalsData, healthData, activityData] = await Promise.all([
        getWeightEntries(),
        getGoals(),
        getTodaysHealthMetrics(),
        getTodaysActivity()
      ]);
      
      setWeightEntries(weights);
      setGoals(goalsData);
      setTodaysHealth(healthData);
      setTodaysActivity(activityData);
    };

    loadData();
  }, []);

  const handleAddWeight = async () => {
    if (!newWeight) return;
    
    const result = await addWeightEntry(parseFloat(newWeight));
    if (result) {
      setWeightEntries(prev => [result, ...prev]);
      setNewWeight("");
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.type || !newGoal.target) return;
    
    const result = await addGoal(newGoal.type, parseFloat(newGoal.target));
    if (result) {
      setGoals(prev => [result, ...prev]);
      setNewGoal({ type: "", target: "" });
    }
  };

  const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : 0;
  const weightChange = weightEntries.length > 1 ? 
    weightEntries[0].weight - weightEntries[1].weight : 0;

  // Default values if no data exists
  const mockTodaysActivity = {
    steps: todaysActivity?.steps || 0,
    activeTime: todaysActivity?.active_time || 0,
    calories: todaysActivity?.calories_burned || 0
  };

  const mockHealthMetrics = {
    mood: todaysHealth?.mood || 0,
    energy: todaysHealth?.energy || 0,
    sleep: todaysHealth?.sleep || 0,
    digestion: todaysHealth?.digestion || 0
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Activity className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockTodaysActivity.steps.toLocaleString()}</div>
              <div className="text-red-100 text-sm">Steps</div>
            </div>
            <div>
              <Flame className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockTodaysActivity.calories}</div>
              <div className="text-red-100 text-sm">Cal Burned</div>
            </div>
            <div>
              <Heart className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockHealthMetrics.mood || "---"}/10</div>
              <div className="text-red-100 text-sm">Mood</div>
            </div>
            <div>
              <Activity className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockHealthMetrics.energy || "---"}/10</div>
              <div className="text-red-100 text-sm">Energy</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <Button 
              onClick={handleAddWeight} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Weight
            </Button>
          </div>

          {weightEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Recent Entries:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {weightEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="font-medium">{entry.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity Summary */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            This Week's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{mockTodaysActivity.steps.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg Daily Steps</div>
              <div className="text-xs text-gray-500 mt-1">Goal: 10,000</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{mockTodaysActivity.activeTime * 7}</div>
              <div className="text-sm text-gray-600">Total Active Minutes</div>
              <div className="text-xs text-gray-500 mt-1">This week</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{mockTodaysActivity.calories * 7}</div>
              <div className="text-sm text-gray-600">Total Calories Burned</div>
              <div className="text-xs text-gray-500 mt-1">This week</div>
            </div>
          </div>
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
          
          <Button 
            onClick={handleAddGoal} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
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
                      {goal.current || 0} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(((goal.current || 0) / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Metrics Overview */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Metrics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">{mockHealthMetrics.mood || "---"}/10</div>
              <div className="text-sm text-gray-600">Mood</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-700">{mockHealthMetrics.energy || "---"}/10</div>
              <div className="text-sm text-gray-600">Energy</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">{mockHealthMetrics.sleep || "---"}/10</div>
              <div className="text-sm text-gray-600">Sleep</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-700">{mockHealthMetrics.digestion || "---"}/10</div>
              <div className="text-sm text-gray-600">Digestion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
