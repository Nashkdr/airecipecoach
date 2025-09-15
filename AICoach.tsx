
import React, { useState, useEffect, useRef } from 'react';
import { startAiCoachChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { ICONS } from '../constants';
import { Chat } from '@google/genai';

const AICoach: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(startAiCoachChat());
        setMessages([{ role: 'model', text: 'Hello! I am NutriAI, your personal nutrition coach. How can I help you today?' }]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const resultStream = await chat.sendMessageStream({ message: userInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of resultStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    modelResponse += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = modelResponse;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg flex flex-col h-[70vh]">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">AI Coach</h2>
                </div>

                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && ICONS.AI}
                            <div className={`p-3 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            {msg.role === 'user' && ICONS.USER}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                         <div className="flex items-start gap-3">
                             {ICONS.AI}
                             <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask a nutrition question..."
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-primary-300" disabled={isLoading}>
                            {ICONS.SEND}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AICoach;