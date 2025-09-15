import React from 'react';
import type { UserProfile, MealPlan, DailyMealPlan, Meal } from '../types.ts';
import LoadingSpinner from './LoadingSpinner.tsx';

interface MealPlannerProps {
    userProfile: UserProfile;
    mealPlan: MealPlan | null;
    isLoading: boolean;
    error: string | null;
}

const MealCard: React.FC<{ title: string; meal: Meal }> = ({ title, meal }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <p className="text-sm font-bold text-primary-600">{meal.name}</p>
        <p className="text-xs text-gray-500 mt-1">{meal.description}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{meal.calories.toFixed(0)} kcal</p>
    </div>
);

const DailyPlanCard: React.FC<{ plan: DailyMealPlan }> = ({ plan }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-gray-800">{plan.day}</h3>
            <p className="font-semibold text-primary-700">{plan.totalCalories.toFixed(0)} kcal</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MealCard title="Breakfast" meal={plan.breakfast} />
            <MealCard title="Lunch" meal={plan.lunch} />
            <MealCard title="Dinner" meal={plan.dinner} />
            {plan.snacks.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                    <h4 className="font-semibold text-gray-700">Snacks</h4>
                    {plan.snacks.map((snack, i) => (
                         <div key={i} className="mt-2 pt-2 border-t first:mt-0 first:pt-0 first:border-t-0">
                            <p className="text-sm font-bold text-primary-600">{snack.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{snack.description}</p>
                             <p className="text-xs text-gray-500 mt-1 font-medium">{snack.calories.toFixed(0)} kcal</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);


const MealPlanner: React.FC<MealPlannerProps> = ({ userProfile, mealPlan, isLoading, error }) => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Your 7-Day Meal Plan</h2>
                <p className="text-gray-500 mt-2">Here's a personalized plan to help you reach your <span className="font-semibold text-primary-600">{userProfile.dietGoal}</span> goal.</p>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>}
            
            {mealPlan && !isLoading && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {mealPlan.plan.map(dailyPlan => (
                        <DailyPlanCard key={dailyPlan.day} plan={dailyPlan} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
