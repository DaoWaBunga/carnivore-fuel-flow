import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  mealSchema, 
  weightSchema, 
  healthMetricsSchema, 
  goalSchema,
  type MealFormData,
  type WeightFormData,
  type HealthMetricsFormData,
  type GoalFormData
} from '@/lib/validation';
import { dataRateLimiter } from '@/lib/rateLimiter';
import { handleSecureError, createSecureError, sanitizeInput, sanitizeNumericInput } from '@/lib/errorHandler';

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  user_id: string;
}

export interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  mood?: number;
  energy?: number;
  sleep?: number;
  digestion?: number;
  notes?: string;
}

export interface ActivityData {
  id: string;
  user_id: string;
  date: string;
  steps?: number;
  active_time?: number;
  calories_burned?: number;
}

export interface Goal {
  id: string;
  user_id: string;
  type: string;
  target: number;
  current?: number;
}

export interface MealEntry {
  id: string;
  user_id: string;
  food_name: string;
  quantity?: number;
  unit?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  meal_time?: string;
  date: string;
}

export const useSecureSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkRateLimit = (operation: string) => {
    const identifier = `${user?.id || 'anonymous'}_${operation}`;
    if (!dataRateLimiter.isAllowed(identifier)) {
      throw createSecureError(
        'Too many requests. Please wait a moment before trying again.',
        `Rate limit exceeded for operation: ${operation}, user: ${user?.id}`,
        'RATE_LIMIT_EXCEEDED'
      );
    }
  };

  const ensureAuthenticated = () => {
    if (!user) {
      throw createSecureError(
        'You must be logged in to perform this action.',
        'Attempted data operation without authentication',
        'AUTHENTICATION_REQUIRED'
      );
    }
  };

  // Weight entries
  const addWeightEntry = async (weight: number) => {
    setLoading(true);
    try {
      ensureAuthenticated();
      checkRateLimit('add_weight');
      
      const validatedWeight = sanitizeNumericInput(weight, 50, 1000);
      const validationResult = weightSchema.safeParse({ weight: validatedWeight });
      
      if (!validationResult.success) {
        throw createSecureError(
          'Please enter a valid weight between 50-1000 lbs',
          `Weight validation failed: ${validationResult.error.message}`,
          'WEIGHT_VALIDATION_ERROR'
        );
      }

      const { data, error } = await supabase
        .from('weight_entries')
        .insert([
          {
            user_id: user!.id,
            weight: validatedWeight,
            date: new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single();

      if (error) {
        throw createSecureError(
          'Unable to save weight entry. Please try again.',
          `Database error adding weight entry: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      toast({
        title: "Weight Logged! ⚖️",
        description: `${validatedWeight} lbs recorded for today`
      });
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWeightEntries = async () => {
    try {
      ensureAuthenticated();
      checkRateLimit('get_weight');

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (error) {
        throw createSecureError(
          'Unable to load weight entries.',
          `Database error fetching weight entries: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data || [];
    } catch (error) {
      handleSecureError(error, toast);
      return [];
    }
  };

  // Health metrics
  const addHealthMetric = async (metrics: Partial<HealthMetricsFormData>) => {
    setLoading(true);
    try {
      ensureAuthenticated();
      checkRateLimit('add_health_metric');

      // Sanitize notes if present
      const sanitizedMetrics = {
        ...metrics,
        notes: metrics.notes ? sanitizeInput(metrics.notes) : undefined
      };

      const validationResult = healthMetricsSchema.safeParse(sanitizedMetrics);
      
      if (!validationResult.success) {
        throw createSecureError(
          'Please check your health metric values and try again.',
          `Health metrics validation failed: ${validationResult.error.message}`,
          'HEALTH_METRICS_VALIDATION_ERROR'
        );
      }

      const { data, error } = await supabase
        .from('health_metrics')
        .upsert([
          {
            user_id: user!.id,
            date: new Date().toISOString().split('T')[0],
            ...validationResult.data
          }
        ])
        .select()
        .single();

      if (error) {
        throw createSecureError(
          'Unable to save health metrics. Please try again.',
          `Database error adding health metric: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      toast({
        title: "Health Metrics Updated! 💪",
        description: "Your daily metrics have been recorded"
      });
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysHealthMetrics = async () => {
    try {
      ensureAuthenticated();
      checkRateLimit('get_health_metrics');

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        throw createSecureError(
          'Unable to load health metrics.',
          `Database error fetching health metrics: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    }
  };

  // Goals
  const addGoal = async (type: string, target: number) => {
    setLoading(true);
    try {
      ensureAuthenticated();
      checkRateLimit('add_goal');

      const sanitizedType = sanitizeInput(type);
      const validatedTarget = sanitizeNumericInput(target, 0.1, 100000);
      
      const validationResult = goalSchema.safeParse({ 
        type: sanitizedType, 
        target: validatedTarget 
      });
      
      if (!validationResult.success) {
        throw createSecureError(
          'Please enter a valid goal type and target.',
          `Goal validation failed: ${validationResult.error.message}`,
          'GOAL_VALIDATION_ERROR'
        );
      }

      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user!.id,
            type: validationResult.data.type,
            target: validationResult.data.target,
            current: 0
          }
        ])
        .select()
        .single();

      if (error) {
        throw createSecureError(
          'Unable to save goal. Please try again.',
          `Database error adding goal: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      toast({
        title: "Goal Added! 🎯",
        description: `New ${validationResult.data.type} goal set`
      });
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getGoals = async () => {
    try {
      ensureAuthenticated();
      checkRateLimit('get_goals');

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw createSecureError(
          'Unable to load goals.',
          `Database error fetching goals: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data || [];
    } catch (error) {
      handleSecureError(error, toast);
      return [];
    }
  };

  // Meals
  const addMeal = async (meal: Omit<MealFormData, 'user_id'>) => {
    setLoading(true);
    try {
      ensureAuthenticated();
      checkRateLimit('add_meal');

      // Validate that required fields are present before sanitization
      if (!meal.food_name || meal.food_name.trim() === '') {
        throw createSecureError(
          'Food name is required.',
          'Attempted to add meal without food_name',
          'MEAL_VALIDATION_ERROR'
        );
      }

      // Sanitize string inputs - ensuring food_name remains non-empty
      const sanitizedFoodName = sanitizeInput(meal.food_name);
      if (!sanitizedFoodName || sanitizedFoodName.trim() === '') {
        throw createSecureError(
          'Food name contains invalid characters.',
          'Food name became empty after sanitization',
          'MEAL_VALIDATION_ERROR'
        );
      }

      const sanitizedMeal = {
        ...meal,
        food_name: sanitizedFoodName,
        unit: meal.unit ? sanitizeInput(meal.unit) : undefined,
        meal_time: meal.meal_time ? sanitizeInput(meal.meal_time) : undefined,
      };

      const validationResult = mealSchema.safeParse(sanitizedMeal);
      
      if (!validationResult.success) {
        throw createSecureError(
          'Please check your meal information and try again.',
          `Meal validation failed: ${validationResult.error.message}`,
          'MEAL_VALIDATION_ERROR'
        );
      }

      // Ensure food_name is definitely a string after validation
      const validatedData = validationResult.data;
      const mealToInsert = {
        user_id: user!.id,
        food_name: validatedData.food_name as string, // Type assertion since we validated it exists
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        calories: validatedData.calories,
        protein: validatedData.protein,
        fat: validatedData.fat,
        carbs: validatedData.carbs,
        meal_time: validatedData.meal_time,
        date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('meals')
        .insert([mealToInsert])
        .select()
        .single();

      if (error) {
        throw createSecureError(
          'Unable to save meal. Please try again.',
          `Database error adding meal: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      toast({
        title: "Meal Added! 🥩",
        description: `${validatedData.quantity}g of ${validatedData.food_name} logged successfully`
      });
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysMeals = async () => {
    try {
      ensureAuthenticated();
      checkRateLimit('get_meals');

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) {
        throw createSecureError(
          'Unable to load meals.',
          `Database error fetching meals: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data || [];
    } catch (error) {
      handleSecureError(error, toast);
      return [];
    }
  };

  // Activity tracking
  const updateTodaysActivity = async (activity: Partial<ActivityData>) => {
    setLoading(true);
    try {
      ensureAuthenticated();
      checkRateLimit('update_activity');

      // Validate numeric inputs
      const sanitizedActivity = {
        steps: activity.steps ? sanitizeNumericInput(activity.steps, 0, 100000) : undefined,
        active_time: activity.active_time ? sanitizeNumericInput(activity.active_time, 0, 1440) : undefined,
        calories_burned: activity.calories_burned ? sanitizeNumericInput(activity.calories_burned, 0, 10000) : undefined,
      };

      const { data, error } = await supabase
        .from('activity_tracking')
        .upsert([
          {
            user_id: user!.id,
            date: new Date().toISOString().split('T')[0],
            ...sanitizedActivity
          }
        ])
        .select()
        .single();

      if (error) {
        throw createSecureError(
          'Unable to save activity data. Please try again.',
          `Database error updating activity: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysActivity = async () => {
    try {
      ensureAuthenticated();
      checkRateLimit('get_activity');

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('activity_tracking')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        throw createSecureError(
          'Unable to load activity data.',
          `Database error fetching activity: ${error.message}`,
          'DATABASE_ERROR'
        );
      }
      
      return data;
    } catch (error) {
      handleSecureError(error, toast);
      return null;
    }
  };

  return {
    loading,
    addWeightEntry,
    getWeightEntries,
    addHealthMetric,
    getTodaysHealthMetrics,
    addGoal,
    getGoals,
    addMeal,
    getTodaysMeals,
    updateTodaysActivity,
    getTodaysActivity
  };
};
