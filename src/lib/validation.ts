
import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
});

// Meal validation schema
export const mealSchema = z.object({
  food_name: z.string().min(1, 'Food name is required').max(100, 'Food name must be less than 100 characters'),
  quantity: z.number().min(0.1, 'Quantity must be at least 0.1').max(10000, 'Quantity seems too large'),
  unit: z.string().optional(),
  calories: z.number().min(0, 'Calories cannot be negative').max(10000, 'Calories seem too high').optional(),
  protein: z.number().min(0, 'Protein cannot be negative').max(1000, 'Protein seems too high').optional(),
  fat: z.number().min(0, 'Fat cannot be negative').max(1000, 'Fat seems too high').optional(),
  carbs: z.number().min(0, 'Carbs cannot be negative').max(1000, 'Carbs seem too high').optional(),
  meal_time: z.string().optional(),
});

// Weight validation schema
export const weightSchema = z.object({
  weight: z.number().min(50, 'Weight must be at least 50 lbs').max(1000, 'Weight seems too high'),
});

// Health metrics validation schema
export const healthMetricsSchema = z.object({
  mood: z.number().min(1, 'Mood must be between 1-10').max(10, 'Mood must be between 1-10').optional(),
  energy: z.number().min(1, 'Energy must be between 1-10').max(10, 'Energy must be between 1-10').optional(),
  sleep: z.number().min(1, 'Sleep must be between 1-10').max(10, 'Sleep must be between 1-10').optional(),
  digestion: z.number().min(1, 'Digestion must be between 1-10').max(10, 'Digestion must be between 1-10').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// Goal validation schema
export const goalSchema = z.object({
  type: z.string().min(1, 'Goal type is required').max(50, 'Goal type must be less than 50 characters'),
  target: z.number().min(0.1, 'Target must be greater than 0').max(100000, 'Target seems too high'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type MealFormData = z.infer<typeof mealSchema>;
export type WeightFormData = z.infer<typeof weightSchema>;
export type HealthMetricsFormData = z.infer<typeof healthMetricsSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
