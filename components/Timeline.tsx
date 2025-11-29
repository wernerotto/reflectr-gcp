import React from 'react';
import { Trade, EmotionalState, Outcome } from '../types';
import { Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TimelineProps {
  trades: Trade[];
  onSelect: (trade: Trade) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ trades, onSelect }) => {
  
  if (trades.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No trades logged yet.</p>
        <p className="text-sm">Start by clicking "Check-In" before your next trade.</p>
      </div>
    );
  }

  const getEmotionColor = (state: EmotionalState) => {
    switch (state) {
      case EmotionalState.Neutral: return 'text-blue-400 border-blue-500/30 bg-blue-500/5';
      case EmotionalState.Charged: return 'text-red-400 border-red-500/30 bg-red-500/5';
      case EmotionalState.Rushed: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
      case EmotionalState.Fragile: return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      default: return 'text-gray-400 border-gray-500/30';
    }
  };

  const getOutcomeBadge = (outcome?: Outcome) => {
    if (!outcome || outcome === Outcome.Pending) return <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">Pending</span>;
    if (outcome === Outcome.Win) return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">WIN</span>;
    if (outcome === Outcome.Loss) return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">LOSS</span>;
    return <span className="text-xs bg-gray-600/20 text-gray-300 px-2 py-1 rounded">BE</span>;
  };

  return (
    <div className="space-y-3">
      {trades.map((trade) => (
        <div 
          key={trade.id}
          onClick={() => onSelect(trade)}
          className={`relative group bg-surface border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all cursor-pointer ${!trade.isComplete ? 'border-l-4 border-l-neon' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-lg tracking-wide">{trade.symbol}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getEmotionColor(trade.emotionalState)}`}>
                {trade.emotionalState}
              </span>
              {trade.impulsiveness > 6 && (
                <span className="text-xs flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  <AlertTriangle size={10} /> Impulse
                </span>
              )}
            </div>
            <div>
              {getOutcomeBadge(trade.outcome)}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="text-sm text-gray-400 truncate max-w-[70%]">
              {trade.reason || "No notes provided."}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
               <Clock size={12} />
               {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity backdrop-blur-[1px]">
            <span className={`text-black font-bold px-4 py-2 rounded-lg shadow-[0_0_15px_#32FFF6] flex items-center gap-2 ${trade.isComplete ? 'bg-white' : 'bg-neon'}`}>
               {trade.isComplete ? 'Edit Entry' : 'Complete Debrief'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};