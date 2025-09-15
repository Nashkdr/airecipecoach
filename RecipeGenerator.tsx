
import React, { useState } from 'react';
import { generateRecipe } from '../services/geminiService';
import type { Recipe, UserProfile } from '../types';
import LoadingSpinner from './LoadingSpinner';
import RecipeCard from './RecipeCard';

interface RecipeGeneratorProps {
    userProfile: UserProfile | null;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ userProfile }) => {
    const [ingredients, setIngredients] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredients.trim()) {
            setError("Please enter some ingredients.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const result = await generateRecipe(ingredients, userProfile);
            setRecipe(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800">Recipe Generator</h2>
                <p className="text-gray-500 mt-2 mb-6">What's in your fridge? Let's create something delicious!</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g., chicken breast, broccoli, rice"
                            className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-300 disabled:bg-primary-300"
                        >
                            {isLoading ? 'Generating...' : 'Generate Recipe'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-10">
                {isLoading && <LoadingSpinner />}
                {error && <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>}
                {recipe && <RecipeCard recipe={recipe} />}
            </div>
        </div>
    );
};

export default RecipeGenerator;