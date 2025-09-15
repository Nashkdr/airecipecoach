

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} NutriAI Coach. All Rights Reserved.</p>
                <p className="text-sm mt-1">Your Personal AI-Powered Diet and Recipe Assistant.</p>
            </div>
        </footer>
    );
};

export default Footer;