import React, { useState } from 'react';
import type { UserProfile } from '../types.ts';
import { DietGoal } from '../types.ts';
import { DIET_GOALS_OPTIONS } from '../constants.tsx';

interface UserProfileFormProps {
    onSave: (profile: UserProfile) => void;
    userProfile: UserProfile | null;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave, userProfile }) => {
    const [profile, setProfile] = useState<UserProfile>(userProfile || {
        age: 30,
        weight: 70,
        height: 175,
        dietGoal: DietGoal.WEIGHT_LOSS,
        allergies: '',
        cuisine: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (profile.age <= 0) newErrors.age = "Age must be positive.";
        if (profile.weight <= 0) newErrors.weight = "Weight must be positive.";
        if (profile.height <= 0) newErrors.height = "Height must be positive.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(profile);
        }
    };

    const FormField: React.FC<{ label: string; children: React.ReactNode; error?: string }> = ({ label, children, error }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tell Us About Yourself</h2>
            <p className="text-gray-500 mb-6">This helps us create the perfect plan for you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField label="Age" error={errors.age}>
                        <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </FormField>
                    <FormField label="Weight (kg)" error={errors.weight}>
                        <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </FormField>
                    <FormField label="Height (cm)" error={errors.height}>
                        <input type="number" name="height" value={profile.height} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </FormField>
                </div>

                <FormField label="Primary Health Goal">
                    <select name="dietGoal" value={profile.dietGoal} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                        {DIET_GOALS_OPTIONS.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                    </select>
                </FormField>

                <FormField label="Allergies or Dislikes (comma-separated)">
                    <input type="text" name="allergies" value={profile.allergies} onChange={handleChange} placeholder="e.g., peanuts, shellfish" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </FormField>

                <FormField label="Favorite Cuisines (optional)">
                    <input type="text" name="cuisine" value={profile.cuisine} onChange={handleChange} placeholder="e.g., Italian, Mexican" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </FormField>

                <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Create My Plan
                </button>
            </form>
        </div>
    );
};

export default UserProfileForm;
