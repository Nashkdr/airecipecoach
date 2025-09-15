import React from 'react';
import type { Recipe } from '../types.ts';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    
    const NutritionInfo: React.FC<{ label: string, value: number, unit: string }> = ({ label, value, unit }) => (
        <div className="text-center bg-gray-100 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
            <p className="font-bold text-lg text-primary-700">{value.toFixed(0)}{unit}</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <NutritionInfo label="Calories" value={recipe.calories} unit=" kcal" />
                <NutritionInfo label="Protein" value={recipe.protein} unit="g" />
                <NutritionInfo label="Carbs" value={recipe.carbs} unit="g" />
                <NutritionInfo label="Fat" value={recipe.fat} unit="g" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
