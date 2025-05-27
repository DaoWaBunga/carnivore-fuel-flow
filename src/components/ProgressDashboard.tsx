
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Weight, Activity, Heart } from "lucide-react";

const weightData = [
  { date: "Week 1", weight: 180, energy: 7 },
  { date: "Week 2", weight: 178, energy: 8 },
  { date: "Week 3", weight: 176, energy: 8 },
  { date: "Week 4", weight: 175, energy: 9 },
  { date: "Week 5", weight: 173, energy: 9 },
  { date: "Week 6", weight: 172, energy: 8 },
];

const weeklyNutrition = [
  { week: "W1", protein: 150, fat: 120, organs: 2 },
  { week: "W2", protein: 165, fat: 135, organs: 3 },
  { week: "W3", protein: 170, fat: 140, organs: 4 },
  { week: "W4", protein: 160, fat: 130, organs: 3 },
  { week: "W5", protein: 175, fat: 145, organs: 5 },
  { week: "W6", protein: 180, fat: 150, organs: 4 },
];

export const ProgressDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Current Weight</p>
                <p className="text-2xl font-bold">172 lbs</p>
                <p className="text-red-100 text-xs">-8 lbs this month</p>
              </div>
              <Weight className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Energy Level</p>
                <p className="text-2xl font-bold">8/10</p>
                <p className="text-orange-100 text-xs">+2 from last week</p>
              </div>
              <Activity className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Carnivore Streak</p>
                <p className="text-2xl font-bold">42 days</p>
                <p className="text-amber-100 text-xs">Personal best!</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Mood Rating</p>
                <p className="text-2xl font-bold">9/10</p>
                <p className="text-red-100 text-xs">Excellent</p>
              </div>
              <Heart className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight & Energy Trend */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Weight & Energy Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis yAxisId="weight" domain={[170, 185]} stroke="#dc2626" />
              <YAxis yAxisId="energy" orientation="right" domain={[0, 10]} stroke="#ea580c" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
              />
              <Line 
                yAxisId="weight" 
                type="monotone" 
                dataKey="weight" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                name="Weight (lbs)"
              />
              <Line 
                yAxisId="energy" 
                type="monotone" 
                dataKey="energy" 
                stroke="#ea580c" 
                strokeWidth={3}
                dot={{ fill: '#ea580c', strokeWidth: 2, r: 6 }}
                name="Energy Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nutrition Breakdown */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800">Weekly Nutrition Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyNutrition}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
              />
              <Bar dataKey="protein" fill="#dc2626" name="Protein (g)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="fat" fill="#ea580c" name="Fat (g)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="organs" fill="#f59e0b" name="Organ Servings" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
