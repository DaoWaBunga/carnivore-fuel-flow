
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, Activity, Moon, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, HealthMetric } from "@/hooks/useSupabaseData";

export const HealthTracker = () => {
  const [metrics, setMetrics] = useState<Partial<HealthMetric>>({
    mood: 5,
    energy: 5,
    sleep: 5,
    digestion: 5,
    notes: ""
  });
  
  const { toast } = useToast();
  const { loading, addHealthMetric, getTodaysHealthMetrics } = useSupabaseData();

  // Load today's metrics on component mount
  useEffect(() => {
    const loadTodaysMetrics = async () => {
      try {
        const todaysMetrics = await getTodaysHealthMetrics();
        if (todaysMetrics) {
          setMetrics({
            mood: todaysMetrics.mood || 5,
            energy: todaysMetrics.energy || 5,
            sleep: todaysMetrics.sleep || 5,
            digestion: todaysMetrics.digestion || 5,
            notes: todaysMetrics.notes || ""
          });
        }
      } catch (error) {
        console.error('Error loading health metrics:', error);
        toast({
          title: "Error Loading Metrics",
          description: "Failed to load today's health metrics",
          variant: "destructive"
        });
      }
    };

    loadTodaysMetrics();
  }, [getTodaysHealthMetrics, toast]);

  const handleSubmit = async () => {
    const result = await addHealthMetric(metrics);
    
    if (result) {
      toast({
        title: "Health Metrics Saved! 💪",
        description: "Your daily health tracking has been updated"
      });
    }
  };

  const metricConfigs = [
    {
      key: "mood" as const,
      label: "Mood",
      icon: Heart,
      color: "text-pink-600",
      description: "How are you feeling today?"
    },
    {
      key: "energy" as const,
      label: "Energy Level",
      icon: Activity,
      color: "text-orange-600",
      description: "Your energy throughout the day"
    },
    {
      key: "sleep" as const,
      label: "Sleep Quality",
      icon: Moon,
      color: "text-blue-600",
      description: "How well did you sleep last night?"
    },
    {
      key: "digestion" as const,
      label: "Digestion",
      icon: Utensils,
      color: "text-green-600",
      description: "How is your digestion feeling?"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Daily Health Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {metricConfigs.map((config) => {
            const Icon = config.icon;
            const value = metrics[config.key] || 5;
            
            return (
              <div key={config.key} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <Label className="font-medium">{config.label}</Label>
                  <span className="text-sm text-gray-500 ml-auto">{value}/10</span>
                </div>
                <p className="text-sm text-gray-600">{config.description}</p>
                <Slider
                  value={[value]}
                  onValueChange={(newValue) => 
                    setMetrics(prev => ({ ...prev, [config.key]: newValue[0] }))
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            );
          })}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling today? Any observations about your carnivore journey..."
              value={metrics.notes || ""}
              onChange={(e) => setMetrics(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Save Health Metrics
          </Button>
        </CardContent>
      </Card>

      {/* Quick Health Summary */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricConfigs.map((config) => {
              const Icon = config.icon;
              const value = metrics[config.key] || 5;
              
              return (
                <div key={config.key} className="text-center p-3 bg-gray-50 rounded-lg">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                  <div className="font-semibold">{value}/10</div>
                  <div className="text-xs text-gray-600">{config.label}</div>
                </div>
              );
            })}
          </div>
          
          {metrics.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Today's Notes:</h4>
              <p className="text-sm text-blue-700">{metrics.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
