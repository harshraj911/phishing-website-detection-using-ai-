
import React from 'react';

interface ExampleURLsProps {
  onExampleClick: (url: string) => void;
  isLoading: boolean;
}

const examples = [
  { name: "Legitimate", url: "https://www.google.com" },
  { name: "Legitimate", url: "https://github.com" },
  { name: "Phishing", url: "http://secure-login-apple-id.com" },
  { name: "Phishing", url: "http://paypal-support-billing.net" },
];

export const ExampleURLs: React.FC<ExampleURLsProps> = ({ onExampleClick, isLoading }) => {
  const handleClick = (url: string) => {
    if (!isLoading) {
      onExampleClick(url);
    }
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-400 mb-2">Or try an example:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((ex, index) => (
          <button
            key={index}
            onClick={() => handleClick(ex.url)}
            disabled={isLoading}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
              ex.name === "Legitimate" 
                ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
                : 'bg-red-900/50 text-red-300 hover:bg-red-800/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {ex.name}
          </button>
        ))}
      </div>
    </div>
  );
};
