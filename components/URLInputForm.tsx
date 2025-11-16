
import React, { useState } from 'react';
import { ScanIcon } from './icons';

interface URLInputFormProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

export const URLInputForm: React.FC<URLInputFormProps> = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(url);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow duration-200 text-lg"
                    disabled={isLoading}
                    required
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={isLoading}
                >
                    <ScanIcon className="w-5 h-5 mr-2" />
                    <span>{isLoading ? 'Scanning...' : 'Scan URL'}</span>
                </button>
            </div>
        </form>
    );
};
