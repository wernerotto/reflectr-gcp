import React from 'react';
import { Trade, EmotionalState, Outcome } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { TrendingUp, AlertOctagon, Brain, Zap } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
}

export const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  // --- Stats Calculation ---
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.outcome === Outcome.Win).length;
  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  
  // Emotional Breakdown
  const emotionData = [
    { name: 'Neutral', value: trades.filter(t => t.emotionalState === EmotionalState.Neutral).length, color: '#3B82F6' },
    { name: 'Rushed', value: trades.filter(t => t.emotionalState === EmotionalState.Rushed).length, color: '#EAB308' },
    { name: 'Charged', value: trades.filter(t => t.emotionalState === EmotionalState.Charged).length, color: '#EF4444' },
    { name: 'Fragile', value: trades.filter(t => t.emotionalState === EmotionalState.Fragile).length, color: '#A855F7' },
  ].filter(d => d.value > 0);

  // Confidence vs Outcome
  const confidenceData = trades.map(t => ({
    name: t.id.substring(6, 9),
    confidence: t.confidence,
    outcome: t.outcome === Outcome.Win ? 10 : (t.outcome === Outcome.Loss ? -10 : 0)
  })).slice(0, 10); // Last 10 trades

  // Patterns
  const highImpulseTrades = trades.filter(t => t.impulsiveness > 7);
  const rushedLosses = trades.filter(t => t.emotionalState === EmotionalState.Rushed && t.outcome === Outcome.Loss);

  return (
    <div className="space-y-6">
      
      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-1"><TrendingUp size={16}/> Win Rate</div>
          <div className="text-2xl font-bold text-neon">{winRate}%</div>
        </div>
        <div className="bg-surface border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-1"><Brain size={16}/> Trades</div>
          <div className="text-2xl font-bold text-white">{totalTrades}</div>
        </div>
        <div className="bg-surface border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-1"><Zap size={16}/> High Impulse</div>
          <div className={`text-2xl font-bold ${highImpulseTrades.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {highImpulseTrades.length}
          </div>
        </div>
        <div className="bg-surface border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-1"><AlertOctagon size={16}/> Rushed Losses</div>
          <div className="text-2xl font-bold text-yellow-400">{rushedLosses.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Emotional Distribution */}
        <div className="bg-surface border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Emotional States</h3>
          <div className="h-[200px]">
             {emotionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0E0E0E', borderColor: '#333' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
             )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {emotionData.map(d => (
              <div key={d.name} className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></span>
                <span className="text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Confidence */}
        <div className="bg-surface border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Confidence Levels (Last 10)</h3>
          <div className="h-[200px]">
            {confidenceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0E0E0E', borderColor: '#333' }} />
                  <Bar dataKey="confidence" fill="#32FFF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
