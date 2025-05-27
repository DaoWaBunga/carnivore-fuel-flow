
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Activity, Moon, Smile, Plus, FootprintsIcon, Clock, Flame, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, HealthNote, ActivityData, HealthMetric } from "@/hooks/useSupabaseData";

export const HealthTracker = () => {
  const [mood, setMood] = useState([7]);
  const [energy, setEnergy] = useState([8]);
  const [sleep, setSleep] = useState([7]);
  const [digestion, setDigestion] = useState([8]);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [notes, setNotes] = useState("");
  const [steps, setSteps] = useState("");
  const [activeTime, setActiveTime] = useState("");
  const [activityCalories, setActivityCalories] = useState("");
  const [healthNotes, setHealthNotes] = useState<HealthNote[]>([]);
  const [todaysActivity, setTodaysActivity] = useState<ActivityData | null>(null);
  const [todaysHealthMetrics, setTodaysHealthMetrics] = useState<HealthMetric | null>(null);
  const { toast } = useToast();

  const {
    loading,
    addHealthMetric,
    getTodaysHealthMetrics,
    addBodyMetrics,
    addHealthNote,
    getHealthNotes,
    deleteHealthNote,
    updateTodaysActivity,
    getTodaysActivity
  } = useSupabaseData();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const [healthMetrics, healthNotesData, activityData] = await Promise.all([
        getTodaysHealthMetrics(),
        getHealthNotes(),
        getTodaysActivity()
      ]);
      
      if (healthMetrics) {
        setTodaysHealthMetrics(healthMetrics);
        setMood([healthMetrics.mood || 7]);
        setEnergy([healthMetrics.energy || 8]);
        setSleep([healthMetrics.sleep || 7]);
        setDigestion([healthMetrics.digestion || 8]);
      }
      
      setHealthNotes(healthNotesData);
      setTodaysActivity(activityData);
    };

    loadData();
  }, []);

  const logHealthMetrics = async () => {
    const metrics = [];
    
    if (weight || bodyFat || waist) {
      const bodyMetricsData: any = {};
      if (weight) bodyMetricsData.weight = parseFloat(weight);
      if (bodyFat) bodyMetricsData.body_fat = parseFloat(bodyFat);
      if (waist) bodyMetricsData.waist = parseFloat(waist);
      
      await addBodyMetrics(bodyMetricsData);
      
      if (weight) metrics.push(`Weight: ${weight} lbs`);
      if (bodyFat) metrics.push(`Body Fat: ${bodyFat}%`);
      if (waist) metrics.push(`Waist: ${waist} inches`);
    }

    // Update health metrics
    const healthMetricsData = {
      mood: mood[0],
      energy: energy[0],
      sleep: sleep[0],
      digestion: digestion[0]
    };
    
    await addHealthMetric(healthMetricsData);

    if (notes) {
      const healthNote = {
        notes,
        mood: mood[0],
        energy: energy[0],
        sleep: sleep[0],
        digestion: digestion[0]
      };
      
      const result = await addHealthNote(healthNote);
      if (result) {
        setHealthNotes(prev => [result, ...prev]);
      }
      metrics.push("Health notes");
    }
    
    toast({
      title: "Health Metrics Logged! 📊",
      description: "Your daily health data has been saved successfully"
    });
    
    // Reset form
    setWeight("");
    setBodyFat("");
    setWaist("");
    setNotes("");
  };

  const addActivity = async () => {
    const missingFields = [];
    if (!steps) missingFields.push("steps");
    if (!activeTime) missingFields.push("active time");
    if (!activityCalories) missingFields.push("activity calories");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please enter: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    const activityData = {
      steps: parseInt(steps),
      active_time: parseInt(activeTime),
      calories_burned: parseInt(activityCalories)
    };

    const result = await updateTodaysActivity(activityData);
    
    if (result) {
      setTodaysActivity(result);
      setSteps("");
      setActiveTime("");
      setActivityCalories("");
      
      toast({
        title: "Activity Logged! 🏃‍♂️",
        description: `${steps} steps, ${activeTime} min active, ${activityCalories} cal burned`
      });
    }
  };

  const deleteNote = async (id: string) => {
    const success = await deleteHealthNote(id);
    if (success) {
      setHealthNotes(healthNotes.filter(note => note.id !== id));
      toast({
        title: "Note Deleted",
        description: "Health note has been removed"
      });
    }
  };

  const displayActivity = {
    steps: todaysActivity?.steps || 0,
    activeTime: todaysActivity?.active_time || 0,
    calories: todaysActivity?.calories_burned || 0
  };

  const healthMetrics = [
    {
      label: "Mood",
      value: mood[0],
      setValue: setMood,
      icon: Smile,
      color: "from-green-500 to-green-600",
      description: "How do you feel overall today?"
    },
    {
      label: "Energy Level",
      value: energy[0],
      setValue: setEnergy,
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      description: "Your energy and vitality level"
    },
    {
      label: "Sleep Quality",
      value: sleep[0],
      setValue: setSleep,
      icon: Moon,
      color: "from-blue-500 to-blue-600",
      description: "How well did you sleep last night?"
    },
    {
      label: "Digestion",
      value: digestion[0],
      setValue: setDigestion,
      icon: Heart,
      color: "from-red-500 to-red-600",
      description: "How is your digestive comfort?"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthMetrics.map((metric) => (
          <Card key={metric.label} className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center gap-2 text-lg">
                <div className={`p-2 rounded-full bg-gradient-to-r ${metric.color}`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
                {metric.label}
              </CardTitle>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Poor</span>
                  <span className="text-2xl font-bold text-red-700">{metric.value}/10</span>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
                <Slider
                  value={[metric.value]}
                  onValueChange={metric.setValue}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Tracking */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Daily Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FootprintsIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-700">{displayActivity.steps.toLocaleString()}</div>
              <div className="text-sm text-gray-600">steps</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">{displayActivity.activeTime}</div>
              <div className="text-sm text-gray-600">active minutes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-700">{displayActivity.calories}</div>
              <div className="text-sm text-gray-600">calories burned</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="steps">Steps</Label>
              <Input
                id="steps"
                type="number"
                placeholder="10,000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="activeTime">Active Time (min)</Label>
              <Input
                id="activeTime"
                type="number"
                placeholder="30"
                value={activeTime}
                onChange={(e) => setActiveTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="activityCalories">Activity Calories</Label>
              <Input
                id="activityCalories"
                type="number"
                placeholder="200"
                value={activityCalories}
                onChange={(e) => setActivityCalories(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={addActivity} 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        </CardContent>
      </Card>

      {/* Body Metrics */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Body Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 175"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bodyfat">Body Fat %</Label>
              <Input
                id="bodyfat"
                type="number"
                placeholder="e.g., 15"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="waist">Waist (inches)</Label>
              <Input
                id="waist"
                type="number"
                placeholder="e.g., 32"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Notes */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Daily Health Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">How are you feeling? Any symptoms or observations?</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Great energy today, no joint pain, skin looking clearer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={logHealthMetrics} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Today's Health Data
          </Button>

          {healthNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Previous Health Notes:</h4>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {healthNotes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-700">{new Date(note.date).toLocaleDateString()}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-800 mb-3">{note.notes}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-100 p-2 rounded text-center">
                        <div className="font-medium">Mood</div>
                        <div>{note.mood}/10</div>
                      </div>
                      <div className="bg-orange-100 p-2 rounded text-center">
                        <div className="font-medium">Energy</div>
                        <div>{note.energy}/10</div>
                      </div>
                      <div className="bg-blue-100 p-2 rounded text-center">
                        <div className="font-medium">Sleep</div>
                        <div>{note.sleep}/10</div>
                      </div>
                      <div className="bg-red-100 p-2 rounded text-center">
                        <div className="font-medium">Digestion</div>
                        <div>{note.digestion}/10</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Health Tips */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>💡 Carnivore Health Tip of the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-100">
            Remember to include organ meats like liver at least once a week! They're nutritional powerhouses 
            that provide essential vitamins and minerals often missing from muscle meat alone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
