
export enum DietGoal {
    WEIGHT_LOSS = 'Weight Loss',
    WEIGHT_GAIN = 'Weight Gain',
    MAINTENANCE = 'Maintenance',
    MUSCLE_GAIN = 'Muscle Gain',
    IMPROVE_HEALTH = 'Improve General Health',
}

export interface UserProfile {
    age: number;
    weight: number; // in kg
    height: number; // in cm
    dietGoal: DietGoal;
    allergies: string; // comma-separated
    cuisine: string; // comma-separated
}

export interface CalorieEstimation {
    foodName: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Recipe {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Meal {
    name: string;
    description: string;
    calories: number;
    ingredients: string[];
}

export interface DailyMealPlan {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
    totalCalories: number;
}

export interface MealPlan {
    plan: DailyMealPlan[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ShoppingListItem {
    id: string;
    name: string;
    checked: boolean;
}

export type ActiveFeature = 'plan' | 'recipes' | 'vision' | 'coach' | 'shoppingList';