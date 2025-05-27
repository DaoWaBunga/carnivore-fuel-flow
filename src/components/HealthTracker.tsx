
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Activity, Moon, Smile, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const HealthTracker = () => {
  const [mood, setMood] = useState([7]);
  const [energy, setEnergy] = useState([8]);
  const [sleep, setSleep] = useState([7]);
  const [digestion, setDigestion] = useState([8]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const logHealthMetrics = () => {
    toast({
      title: "Health Metrics Logged! 📊",
      description: "Your daily health data has been saved successfully"
    });
    
    // Reset form
    setWeight("");
    setNotes("");
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
              <Label htmlFor="bodyfat">Body Fat % (optional)</Label>
              <Input
                id="bodyfat"
                type="number"
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="waist">Waist (inches, optional)</Label>
              <Input
                id="waist"
                type="number"
                placeholder="e.g., 32"
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
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Today's Health Data
          </Button>
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
