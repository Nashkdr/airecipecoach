import React from 'react';
import type { UserProfile, ActiveFeature } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface DashboardProps {
    userProfile: UserProfile;
    onSelectFeature: (feature: ActiveFeature) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onSelectFeature }) => {

    const features = [
        { id: 'plan', title: 'Meal Planner', description: 'Get a 7-day personalized meal plan.', icon: ICONS.MEAL_PLAN },
        { id: 'shoppingList', title: 'Shopping List', description: 'Generate a list from your meal plan.', icon: ICONS.SHOPPING_CART },
        { id: 'recipes', title: 'Recipe Generator', description: 'Create recipes from your ingredients.', icon: ICONS.RECIPE_BOOK },
        { id: 'vision', title: 'Calorie Vision', description: 'Analyze meals from a photo.', icon: ICONS.CAMERA_ICON },
        { id: 'coach', title: 'AI Nutrition Coach', description: 'Chat with our AI for expert advice.', icon: ICONS.AI_COACH_CHAT },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Recipe & Diet Coach</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Welcome! Here are your tools to achieve your <span className="font-semibold text-primary-600">{userProfile.dietGoal}</span> goal.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        onClick={() => onSelectFeature(feature.id as ActiveFeature)}
                        className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className="text-primary-600">
                            {feature.icon}
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-gray-800">{feature.title}</h3>
                        <p className="mt-1 text-gray-500">{feature.description}</p>
                    </div>
                ))}
                 <div
                    className="group bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center"
                 >
                    <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-600">More Features Coming Soon</h3>
                    <p className="mt-1 text-gray-500 text-sm">We're always cooking up new ideas!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
