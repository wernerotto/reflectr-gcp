import React, { useState } from 'react';
import { EmotionalState, Trade } from '../types';
import { Button } from './ui/Button';
import { Slider } from './ui/Slider';
import { Input, TextArea } from './ui/Input';
import { X, AlertTriangle } from 'lucide-react';

interface CheckInProps {
  userId: string;
  onComplete: (trade: Trade) => void;
  onCancel: () => void;
}

export const CheckIn: React.FC<CheckInProps> = ({ userId, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [symbol, setSymbol] = useState('');
  const [state, setState] = useState<EmotionalState | null>(null);
  const [impulsiveness, setImpulsiveness] = useState(3);
  const [confidence, setConfidence] = useState(7);
  const [fear, setFear] = useState(2);
  const [reason, setReason] = useState('');
  const [plan, setPlan] = useState('');

  // Logic Rule: Warning if high impulse or Charged/Rushed
  const showWarning = (state === EmotionalState.Charged || state === EmotionalState.Rushed) || impulsiveness > 6;

  const handleFinish = () => {
    if (!state || !symbol) return;

    const newTrade: Trade = {
      id: `trade_${Date.now()}`,
      userId,
      timestamp: Date.now(),
      symbol: symbol.toUpperCase(),
      emotionalState: state,
      impulsiveness,
      confidence,
      fear,
      reason,
      plan,
      isComplete: false
    };

    onComplete(newTrade);
  };

  const emotions = [
    { key: EmotionalState.Neutral, label: 'Neutral', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
    { key: EmotionalState.Rushed, label: 'Rushed', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
    { key: EmotionalState.Fragile, label: 'Fragile', color: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
    { key: EmotionalState.Charged, label: 'Charged', color: 'bg-red-500/20 text-red-300 border-red-500/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
          <h2 className="text-lg font-semibold text-white">Pre-Trade Check-In</h2>
          <button onClick={onCancel}><X className="text-gray-500 hover:text-white" size={20}/></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input 
                label="Asset / Symbol" 
                placeholder="e.g. BTCUSD, NQ, TSLA" 
                value={symbol} 
                onChange={e => setSymbol(e.target.value)}
                autoFocus
              />
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 block">Current Emotional State</label>
                <div className="grid grid-cols-2 gap-3">
                  {emotions.map((e) => (
                    <button
                      key={e.key}
                      onClick={() => setState(e.key)}
                      className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                        state === e.key ? `${e.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] scale-[1.02]` : 'border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button fullWidth onClick={() => setStep(2)} disabled={!symbol || !state}>
                  Next: Vitals
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               {showWarning && (
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="text-red-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-red-400 font-bold text-sm">High Risk Warning</h4>
                    <p className="text-red-200/70 text-xs mt-1">
                      You are entering a trade in a {state} state or high impulsiveness. Reduce size or step away.
                    </p>
                  </div>
                </div>
              )}

              <Slider 
                label="Impulsiveness" 
                value={impulsiveness} 
                onChange={setImpulsiveness} 
                lowLabel="Calculated" 
                highLabel="FOMO"
                colorClass="accent-red-400"
              />
              <Slider 
                label="Confidence" 
                value={confidence} 
                onChange={setConfidence} 
                lowLabel="Unsure" 
                highLabel="Conviction"
                colorClass="accent-neon"
              />
              <Slider 
                label="Fear / Anxiety" 
                value={fear} 
                onChange={setFear} 
                lowLabel="Calm" 
                highLabel="Terrified"
                colorClass="accent-purple-400"
              />

              <div className="space-y-4 pt-2">
                <TextArea 
                  label="Trading Plan (Stops, Targets, Invalidation)" 
                  placeholder="e.g. Enter on retest of 4200. Stop at 4190. Target 4220."
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  rows={2}
                />
                
                <TextArea 
                  label="Context / Reason" 
                  placeholder="e.g. Trend alignment, VWAP bounce..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={handleFinish} className="flex-1">Commit Trade</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};