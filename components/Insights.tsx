import React, { useState } from 'react';
import { Trade, InsightResult } from '../types';
import { geminiService } from '../services/geminiService';
import { Button } from './ui/Button';
import { Sparkles, ShieldAlert, Trophy } from 'lucide-react';

interface InsightsProps {
  trades: Trade[];
  isPro: boolean;
}

export const Insights: React.FC<InsightsProps> = ({ trades, isPro }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InsightResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const data = await geminiService.analyzePsychology(trades);
    setResult(data);
    setLoading(false);
  };

  if (!isPro) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-surface border border-gray-800 rounded-2xl p-6 text-center">
        <Sparkles className="text-gray-600 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">Unlock AI Pattern Recognition</h3>
        <p className="text-gray-400 mb-6 max-w-sm">
          Get weekly psychological reports, pattern detection, and personalized coaching from our AI engine.
        </p>
        <Button disabled className="opacity-50 cursor-not-allowed">
          Upgrade to Pro ($15/mo)
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-surface to-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-neon" size={24} /> 
            Psychology Engine
          </h2>
          <p className="text-gray-400 mb-6">
            Reflectr AI analyzes your last 10 trades to find hidden emotional leaks.
          </p>

          {!result && (
            <Button onClick={handleAnalyze} disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></span>
                  Analyzing Neural Patterns...
                </span>
              ) : 'Generate Insight Report'}
            </Button>
          )}
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="col-span-3 bg-surface border border-gray-800 p-6 rounded-xl">
            <h4 className="text-xs uppercase text-neon font-bold tracking-widest mb-2">Summary</h4>
            <p className="text-lg text-white leading-relaxed">{result.summary}</p>
          </div>

          <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-red-400">
              <ShieldAlert size={20} />
              <h4 className="font-bold">Critical Leak</h4>
            </div>
            <p className="text-sm text-gray-300">{result.riskFactor}</p>
          </div>

          <div className="bg-green-900/10 border border-green-500/20 p-5 rounded-xl">
             <div className="flex items-center gap-2 mb-3 text-green-400">
              <Trophy size={20} />
              <h4 className="font-bold">Core Strength</h4>
            </div>
            <p className="text-sm text-gray-300">{result.strength}</p>
          </div>
          
           <div className="bg-surface border border-gray-800 p-5 rounded-xl flex items-center justify-center">
             <p className="text-xs text-gray-500 text-center">
               AI analysis based on {Math.min(trades.length, 10)} recent trades.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};
