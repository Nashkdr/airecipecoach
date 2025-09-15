import React, { useState, useEffect } from 'react';
import type { UserProfile, MealPlan, ActiveFeature } from './types.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import UserProfileForm from './components/UserProfileForm.tsx';
import MealPlanner from './components/MealPlanner.tsx';
import RecipeGenerator from './components/RecipeGenerator.tsx';
import CalorieVision from './components/CalorieVision.tsx';
import AICoach from './components/AICoach.tsx';
import ShoppingList from './components/ShoppingList.tsx';
import Dashboard from './components/Dashboard.tsx';
import { generateMealPlan } from './services/geminiService.ts';
import AdBanner from './components/AdBanner.tsx';

type AppView = 'profile' | 'dashboard';

const App: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [view, setView] = useState<AppView>('profile');
    const [activeFeature, setActiveFeature] = useState<ActiveFeature | null>(null);
    
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);
    const [planError, setPlanError] = useState<string | null>(null);

    useEffect(() => {
        // Pre-fetch meal plan when user enters the dashboard view
        if (view === 'dashboard' && userProfile && !mealPlan) {
            const fetchMealPlan = async () => {
                setIsPlanLoading(true);
                setPlanError(null);
                try {
                    const plan = await generateMealPlan(userProfile);
                    setMealPlan(plan);
                } catch (e) {
                    setPlanError(e instanceof Error ? e.message : String(e));
                } finally {
                    setIsPlanLoading(false);
                }
            };
            fetchMealPlan();
        }
    }, [view, userProfile, mealPlan]);

    const handleProfileSave = (profile: UserProfile) => {
        setUserProfile(profile);
        setMealPlan(null); // Reset meal plan when profile changes
        setView('dashboard');
        setActiveFeature(null); // Start at the dashboard
    };

    const renderFeatureContent = () => {
        switch (activeFeature) {
            case 'plan':
                return <MealPlanner userProfile={userProfile!} mealPlan={mealPlan} isLoading={isPlanLoading} error={planError} />;
            case 'shoppingList':
                 return <ShoppingList mealPlan={mealPlan} />;
            case 'recipes':
                return <RecipeGenerator userProfile={userProfile} />;
            case 'vision':
                return <CalorieVision />;
            case 'coach':
                return <AICoach />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {view === 'profile' || !userProfile ? (
                    <UserProfileForm onSave={handleProfileSave} userProfile={userProfile} />
                ) : (
                    <div>
                        {activeFeature ? (
                             <div>
                                <button onClick={() => setActiveFeature(null)} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Dashboard
                                </button>
                                {renderFeatureContent()}
                            </div>
                        ) : (
                            <Dashboard 
                                userProfile={userProfile}
                                onSelectFeature={setActiveFeature}
                            />
                        )}
                    </div>
                )}
                <AdBanner />
            </main>
            <Footer />
        </div>
    );
};

export default App;
