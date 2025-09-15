import React, { useState, useEffect, useMemo } from 'react';
import type { MealPlan, ShoppingListItem } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface ShoppingListProps {
    mealPlan: MealPlan | null;
}

const STORAGE_KEY = 'nutri-ai-shopping-list';

const ShoppingList: React.FC<ShoppingListProps> = ({ mealPlan }) => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Load initial items from local storage
    useEffect(() => {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            if (savedItems) {
                setItems(JSON.parse(savedItems));
            }
        } catch (error) {
            console.error("Could not load shopping list from local storage", error);
        }
    }, []);
    
    // Generate and merge list when meal plan is available
    useEffect(() => {
        if (!mealPlan) return;

        const allIngredients = mealPlan.plan.flatMap(day => [
            ...day.breakfast.ingredients,
            ...day.lunch.ingredients,
            ...day.dinner.ingredients,
            ...day.snacks.flatMap(snack => snack.ingredients)
        ]);
        
        // Normalize and deduplicate ingredients
        const uniqueIngredients = [...new Set(allIngredients.map(ing => ing.trim().toLowerCase()))];
        
        setItems(prevItems => {
            const existingItemNames = new Set(prevItems.map(item => item.name.toLowerCase()));
            const newIngredients = uniqueIngredients
                .filter(name => !existingItemNames.has(name))
                .map(name => ({ id: crypto.randomUUID(), name, checked: false }));
            return [...prevItems, ...newIngredients];
        });

    }, [mealPlan]);

    // Save items to local storage on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Could not save shopping list to local storage", error);
        }
    }, [items]);

    const handleToggleItem = (id: string) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };
    
    const handleClearList = () => {
        setItems([]);
    };
    
    const handleCopyToClipboard = () => {
        const listText = filteredItems.map(item => `${item.checked ? '[x]' : '[ ]'} ${item.name}`).join('\n');
        navigator.clipboard.writeText(listText).then(() => {
            alert('Shopping list copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const filteredItems = useMemo(() => {
        if (filter === 'active') return items.filter(item => !item.checked);
        if (filter === 'completed') return items.filter(item => item.checked);
        return items;
    }, [items, filter]);

    if (!mealPlan) {
        return (
            <div className="text-center max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
                 <div className="text-primary-500 mx-auto w-fit">{ICONS.SHOPPING_CART}</div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Your Shopping List</h2>
                <p className="text-gray-500 mt-2">Your shopping list will appear here once your meal plan is generated. Ingredients from all 7 days will be automatically added.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto">
             <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Shopping List</h2>
                    <div className="text-primary-600">{ICONS.SHOPPING_CART}</div>
                </div>

                <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                    <div className="flex border border-gray-200 rounded-md p-1">
                        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
                        <FilterButton active={filter === 'active'} onClick={() => setFilter('active')}>Active</FilterButton>
                        <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</FilterButton>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCopyToClipboard} className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-100 transition-colors">Copy</button>
                        <button onClick={handleClearList} className="text-sm px-3 py-1.5 border rounded-md hover:bg-red-50 text-red-600 transition-colors">Clear</button>
                    </div>
                </div>
                
                 <p className="text-xs text-gray-500 mb-4 text-center bg-gray-50 p-2 rounded-md">
                    Use the 'Buy' links to quickly find ingredients at online grocery stores. (Links open in a new tab)
                </p>

                {items.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Your shopping list is empty.</p>
                ) : (
                    <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {filteredItems.map(item => (
                            <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div onClick={() => handleToggleItem(item.id)} className="flex items-center cursor-pointer mr-4 flex-grow min-w-0">
                                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mr-4 flex items-center justify-center ${item.checked ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                                       {item.checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className={`capitalize truncate ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.name}</span>
                                </div>
                                <a
                                    href={`https://www.instacart.com/store/search/${encodeURIComponent(item.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-100 hover:bg-primary-200 px-3 py-1 rounded-full transition-colors"
                                >
                                    Buy
                                    <div className="w-3 h-3">{ICONS.EXTERNAL_LINK}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
             </div>
        </div>
    );
};

const FilterButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode}> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-3 py-1 text-sm font-medium rounded ${active ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
        {children}
    </button>
)

export default ShoppingList;
