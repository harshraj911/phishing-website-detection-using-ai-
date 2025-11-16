
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} AI Phishing Detector. All rights reserved.</p>
                <p className="text-sm mt-2">Disclaimer: This tool uses AI and is for informational purposes only. It does not guarantee 100% accuracy. Always exercise caution when browsing.</p>
            </div>
        </footer>
    );
}
