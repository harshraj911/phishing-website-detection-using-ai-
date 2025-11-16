
import React, { useState, useCallback } from 'react';
import { URLInputForm } from './components/URLInputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeUrl } from './services/geminiService';
import type { AnalysisResult } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExampleURLs } from './components/ExampleURLs';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      if (!url || !/^(https?:\/\/)/.test(url)) {
          throw new Error("Please enter a valid URL starting with http:// or https://");
      }
      const result = await analyzeUrl(url);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Advanced Phishing Detection
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Paste a URL below to scan for phishing threats using AI.
          </p>
        </div>

        <div className="w-full max-w-3xl p-6 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <URLInputForm onSubmit={handleAnalyze} isLoading={isLoading} />
          <ExampleURLs onExampleClick={handleAnalyze} isLoading={isLoading} />
        </div>
        
        <div className="w-full max-w-3xl mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-lg text-gray-300">Analyzing URL... This may take a moment.</p>
              </div>
            )}
            {error && <div className="p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">{error}</div>}
            {analysisResult && <ResultDisplay result={analysisResult} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
