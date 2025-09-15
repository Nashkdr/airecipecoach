
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import type { UserProfile, CalorieEstimation, Recipe, MealPlan } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
// API key must be obtained exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const calorieEstimationSchema = {
    type: Type.OBJECT,
    properties: {
        foodName: { type: Type.STRING, description: "The name of the food item." },
        description: { type: Type.STRING, description: "A brief description of the meal." },
        calories: { type: Type.NUMBER, description: "Estimated calories in kcal." },
        protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
        carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
        fat: { type: Type.NUMBER, description: "Estimated fat in grams." },
    },
    required: ["foodName", "description", "calories", "protein", "carbs", "fat"],
};

export async function estimateCaloriesFromImage(base64Image: string, mimeType: string): Promise<CalorieEstimation> {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: "Analyze this image of a meal. Identify the food, provide a brief description, and estimate its nutritional content (calories, protein, carbs, fat). Respond in JSON format.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        // For image and text input, gemini-2.5-flash is appropriate.
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: calorieEstimationSchema,
        },
    });

    // Use response.text to get the generated text.
    const jsonString = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonString);
        // Basic validation
        if (
            typeof parsedJson.foodName === 'string' &&
            typeof parsedJson.description === 'string' &&
            typeof parsedJson.calories === 'number' &&
            typeof parsedJson.protein === 'number' &&
            typeof parsedJson.carbs === 'number' &&
            typeof parsedJson.fat === 'number'
        ) {
            return parsedJson as CalorieEstimation;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini API:", e);
        throw new Error("Could not analyze the image. The response was not valid JSON.");
    }
}

const mealSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        calories: { type: Type.NUMBER },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients for this meal." }
    },
    required: ["name", "description", "calories", "ingredients"]
};

const mealPlanSchema = {
    type: Type.OBJECT,
    properties: {
        plan: {
            type: Type.ARRAY,
            description: "An array of daily meal plans for 7 days.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day of the week (e.g., Monday)." },
                    breakfast: mealSchema,
                    lunch: mealSchema,
                    dinner: mealSchema,
                    snacks: {
                        type: Type.ARRAY,
                        items: mealSchema
                    },
                    totalCalories: { type: Type.NUMBER, description: "Total estimated calories for the day." }
                },
                required: ["day", "breakfast", "lunch", "dinner", "snacks", "totalCalories"]
            }
        }
    },
    required: ["plan"]
};

export async function generateMealPlan(profile: UserProfile): Promise<MealPlan> {
    const prompt = `
        Create a 7-day meal plan for a user with the following profile:
        - Age: ${profile.age}
        - Weight: ${profile.weight} kg
        - Height: ${profile.height} cm
        - Goal: ${profile.dietGoal}
        - Allergies/Dislikes: ${profile.allergies || 'None'}
        - Favorite Cuisines: ${profile.cuisine || 'Any'}

        The plan should include breakfast, lunch, dinner, and 1-2 snacks per day.
        For EACH meal (breakfast, lunch, dinner, and each snack), you MUST provide a list of its ingredients.
        Provide an estimated total calorie count for each day.
        Keep the meal descriptions brief but appealing.
        Respond in JSON format.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mealPlanSchema
        }
    });

    const jsonString = response.text.trim();
    try {
        return JSON.parse(jsonString) as MealPlan;
    } catch (e) {
        console.error("Failed to parse meal plan JSON:", e);
        throw new Error("Could not generate a meal plan. Invalid response from AI.");
    }
}

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER }
    },
    required: ["name", "description", "ingredients", "instructions", "calories", "protein", "carbs", "fat"]
};

export async function generateRecipe(ingredients: string, userProfile: UserProfile | null): Promise<Recipe> {
    const profileText = userProfile 
        ? `Consider the user's profile for adjustments: Goal - ${userProfile.dietGoal}, Allergies - ${userProfile.allergies || 'None'}.`
        : '';
    
    const prompt = `
        Generate a healthy and delicious recipe based on the following ingredients: ${ingredients}.
        ${profileText}
        Provide a recipe name, a short description, a list of ingredients, step-by-step instructions, and estimated nutritional information (calories, protein, carbs, fat).
        Respond in JSON format.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema
        }
    });

    const jsonString = response.text.trim();
    try {
        return JSON.parse(jsonString) as Recipe;
    } catch (e) {
        console.error("Failed to parse recipe JSON:", e);
        throw new Error("Could not generate a recipe. Invalid response from AI.");
    }
}

let aiCoachChat: Chat | null = null;

export function startAiCoachChat(): Chat {
    if (!aiCoachChat) {
        // Use ai.chats.create
        aiCoachChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are NutriAI, a friendly and knowledgeable AI nutrition coach. 
                Your goal is to provide helpful, safe, and encouraging advice on diet, nutrition, and healthy living. 
                Do not provide medical advice. If asked about medical conditions, refer the user to a doctor or registered dietitian.
                Keep your answers concise and easy to understand.`,
            },
        });
    }
    return aiCoachChat;
}