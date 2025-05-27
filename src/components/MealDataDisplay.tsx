
import { Utensils } from "lucide-react";

interface MealDataDisplayProps {
  mealData: any;
}

export const MealDataDisplay = ({ mealData }: MealDataDisplayProps) => {
  if (!mealData) return null;
  
  return (
    <div className="mt-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
      <div className="flex items-center gap-2 mb-2">
        <Utensils className="h-4 w-4 text-orange-600" />
        <span className="font-medium text-orange-800">Meal Details</span>
      </div>
      <div className="text-sm text-orange-700 space-y-1">
        {mealData.food_name && (
          <p><strong>Food:</strong> {mealData.food_name}</p>
        )}
        {mealData.quantity && mealData.unit && (
          <p><strong>Quantity:</strong> {mealData.quantity} {mealData.unit}</p>
        )}
        {mealData.calories && (
          <p><strong>Calories:</strong> {mealData.calories}</p>
        )}
        {(mealData.protein || mealData.fat || mealData.carbs) && (
          <div className="flex gap-4 mt-2">
            {mealData.protein && <span>Protein: {mealData.protein}g</span>}
            {mealData.fat && <span>Fat: {mealData.fat}g</span>}
            {mealData.carbs && <span>Carbs: {mealData.carbs}g</span>}
          </div>
        )}
      </div>
    </div>
  );
};
