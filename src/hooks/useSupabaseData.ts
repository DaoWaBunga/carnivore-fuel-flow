
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export interface WaterEntry {
  id: string;
  user_id: string;
  amount: number;
  date: string;
}

export interface NutritionEntry {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  unit: string;
  date: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  weight?: number;
  body_fat?: number;
  waist?: number;
  date: string;
}

export interface HealthNote {
  id: string;
  user_id: string;
  notes: string;
  mood?: number;
  energy?: number;
  sleep?: number;
  digestion?: number;
  date: string;
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Weight entries
  const addWeightEntry = async (weight: number) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([
          {
            user_id: user.id,
            weight: weight,
            date: new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Weight Logged! ⚖️",
        description: `${weight} lbs recorded for today`
      });
      
      return data;
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast({
        title: "Error logging weight",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWeightEntries = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      return [];
    }
  };

  // Water intake
  const addWaterEntry = async (amount: number) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if there's already an entry for today
      const { data: existing } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing entry
        const { data, error } = await supabase
          .from('water_intake')
          .update({ amount: existing.amount + amount })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('water_intake')
          .insert([
            {
              user_id: user.id,
              amount: amount,
              date: today
            }
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error adding water entry:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysWaterIntake = async () => {
    if (!user) return 0;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('water_intake')
        .select('amount')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error) return 0;
      return data?.amount || 0;
    } catch (error) {
      console.error('Error fetching water intake:', error);
      return 0;
    }
  };

  // Nutrition entries
  const addNutritionEntry = async (name: string, amount: number, unit: string) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nutrition_entries')
        .insert([
          {
            user_id: user.id,
            name,
            amount,
            unit,
            date: new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysNutritionEntries = async () => {
    if (!user) return [];
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('nutrition_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching nutrition entries:', error);
      return [];
    }
  };

  // Health metrics
  const addHealthMetric = async (metrics: Partial<HealthMetric>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .upsert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            ...metrics
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Health Metrics Updated! 💪",
        description: "Your daily metrics have been recorded"
      });
      
      return data;
    } catch (error) {
      console.error('Error adding health metric:', error);
      toast({
        title: "Error updating health metrics",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysHealthMetrics = async () => {
    if (!user) return null;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return null;
    }
  };

  // Body metrics
  const addBodyMetrics = async (metrics: Partial<BodyMetric>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('body_metrics')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            ...metrics
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding body metrics:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Health notes
  const addHealthNote = async (note: Omit<HealthNote, 'id' | 'user_id' | 'date'>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_notes')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            ...note
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding health note:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHealthNotes = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('health_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching health notes:', error);
      return [];
    }
  };

  const deleteHealthNote = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('health_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting health note:', error);
      return false;
    }
  };

  // Goals
  const addGoal = async (type: string, target: number) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            type: type,
            target: target,
            current: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Goal Added! 🎯",
        description: `New ${type} goal set`
      });
      
      return data;
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error adding goal",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getGoals = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  };

  // Meals
  const addMeal = async (meal: Omit<MealEntry, 'id' | 'user_id'>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert([
          {
            user_id: user.id,
            ...meal,
            date: meal.date || new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Meal Added! 🥩",
        description: `${meal.quantity}g of ${meal.food_name} logged successfully`
      });
      
      return data;
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        title: "Error adding meal",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysMeals = async () => {
    if (!user) return [];
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching today\'s meals:', error);
      return [];
    }
  };

  // Activity tracking
  const updateTodaysActivity = async (activity: Partial<ActivityData>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_tracking')
        .upsert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            ...activity
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating activity:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodaysActivity = async () => {
    if (!user) return null;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('activity_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching today\'s activity:', error);
      return null;
    }
  };

  return {
    loading,
    addWeightEntry,
    getWeightEntries,
    addWaterEntry,
    getTodaysWaterIntake,
    addNutritionEntry,
    getTodaysNutritionEntries,
    addHealthMetric,
    getTodaysHealthMetrics,
    addBodyMetrics,
    addHealthNote,
    getHealthNotes,
    deleteHealthNote,
    addGoal,
    getGoals,
    addMeal,
    getTodaysMeals,
    updateTodaysActivity,
    getTodaysActivity
  };
};
