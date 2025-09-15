

import React, { useState, useRef } from 'react';
import { estimateCaloriesFromImage } from '../services/geminiService';
import type { CalorieEstimation } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ICONS } from '../constants';

const CalorieVision: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [estimation, setEstimation] = useState<CalorieEstimation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setEstimation(null);
            setError(null);
        } else {
            setError("Please select a valid image file.");
        }
    };

    const handleAnalyzeClick = async () => {
        if (!imageFile) return;

        setIsLoading(true);
        setError(null);
        setEstimation(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const result = await estimateCaloriesFromImage(base64Image, imageFile.type);
            setEstimation(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setIsLoading(false);
        }
    };

    const NutritionInfo: React.FC<{ label: string, value: string | number, unit: string }> = ({ label, value, unit }) => (
        <div className="text-center bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-bold text-xl text-primary-700">{value}{unit}</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800">Calorie Vision</h2>
                <p className="text-gray-500 mt-2">Upload a photo of your meal for an instant nutritional analysis.</p>
                
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 bg-gray-50 transition-colors"
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Meal preview" className="h-full w-full object-cover rounded-md"/>
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            {ICONS.CAMERA}
                            <span className="mt-2">Click to upload a photo</span>
                        </div>
                    )}
                </div>

                {imageFile && (
                    <button
                        onClick={handleAnalyzeClick}
                        disabled={isLoading}
                        className="mt-6 w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 disabled:bg-primary-300 flex items-center justify-center"
                    >
                        {ICONS.SPARKLES}
                        <span className="ml-2">Analyze Meal</span>
                    </button>
                )}
            </div>

             <div className="mt-10">
                {isLoading && <LoadingSpinner />}
                {error && <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>}
                
                {estimation && (
                    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{estimation.foodName}</h3>
                        <p className="text-gray-600 mb-6">{estimation.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <NutritionInfo label="Calories" value={estimation.calories.toFixed(0)} unit=" kcal" />
                            <NutritionInfo label="Protein" value={estimation.protein.toFixed(1)} unit="g" />
                            <NutritionInfo label="Carbs" value={estimation.carbs.toFixed(1)} unit="g" />
                            <NutritionInfo label="Fat" value={estimation.fat.toFixed(1)} unit="g" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalorieVision;