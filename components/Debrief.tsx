import React, { useState } from 'react';
import { Outcome, Trade } from '../types';
import { Button } from './ui/Button';
import { Input, TextArea } from './ui/Input';
import { X, CheckCircle, XCircle, MinusCircle, FileText } from 'lucide-react';

interface DebriefProps {
  trade: Trade;
  onSave: (updatedTrade: Trade) => void;
  onClose: () => void;
}

export const Debrief: React.FC<DebriefProps> = ({ trade, onSave, onClose }) => {
  // Initialize state from props to allow editing of existing data
  const [outcome, setOutcome] = useState<Outcome>(trade.outcome || Outcome.Pending);
  const [followedPlan, setFollowedPlan] = useState<boolean | null>(trade.followedPlan ?? null);
  const [reflection, setReflection] = useState(trade.reflection || '');
  const [tilt, setTilt] = useState(trade.tilt || false);
  const [regret, setRegret] = useState(trade.regret || false);
  const [plan, setPlan] = useState(trade.plan || '');

  const handleSave = () => {
    const updated: Trade = {
      ...trade,
      plan, // Save edited plan
      outcome,
      followedPlan: followedPlan === true,
      reflection,
      tilt,
      regret,
      isComplete: true
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
          <h2 className="text-lg font-semibold text-white">
            {trade.isComplete ? 'Edit Journal Entry' : 'Post-Trade Debrief'} 
            <span className="text-gray-500 font-normal"> | {trade.symbol}</span>
          </h2>
          <button onClick={onClose}><X className="text-gray-500 hover:text-white" size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Plan Verification Section */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-neon" />
              <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Your Plan</h3>
            </div>
            <TextArea 
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="No explicit plan recorded. Add one here..."
              rows={3}
              className="bg-black/20 border-gray-700/50 focus:bg-black/40 text-sm"
            />
            <p className="text-[10px] text-gray-500 mt-1 italic">Review or update your initial plan.</p>
          </div>

          {/* Outcome Selection */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 block">Result</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setOutcome(Outcome.Win)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${outcome === Outcome.Win ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface border-gray-800 text-gray-500 hover:bg-gray-800'}`}
              >
                <CheckCircle size={24} />
                <span className="font-medium">Win</span>
              </button>
              <button 
                onClick={() => setOutcome(Outcome.Loss)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${outcome === Outcome.Loss ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-surface border-gray-800 text-gray-500 hover:bg-gray-800'}`}
              >
                <XCircle size={24} />
                <span className="font-medium">Loss</span>
              </button>
              <button 
                onClick={() => setOutcome(Outcome.Breakeven)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${outcome === Outcome.Breakeven ? 'bg-gray-500/20 border-gray-500 text-gray-300' : 'bg-surface border-gray-800 text-gray-500 hover:bg-gray-800'}`}
              >
                <MinusCircle size={24} />
                <span className="font-medium">BE</span>
              </button>
            </div>
          </div>

          {/* Plan Adherence */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 block">Did you follow your plan?</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setFollowedPlan(true)}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all ${followedPlan === true ? 'bg-neon/10 border-neon text-neon' : 'border-gray-800 text-gray-400 hover:bg-gray-800'}`}
              >
                Yes, Executed Plan
              </button>
              <button 
                onClick={() => setFollowedPlan(false)}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all ${followedPlan === false ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'border-gray-800 text-gray-400 hover:bg-gray-800'}`}
              >
                No, Broke Rules
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
             <label className={`flex-1 p-3 rounded-lg border cursor-pointer select-none transition-all flex items-center justify-center gap-2 ${tilt ? 'bg-red-900/20 border-red-500 text-red-300' : 'border-gray-800 text-gray-500'}`}>
                <input type="checkbox" checked={tilt} onChange={e => setTilt(e.target.checked)} className="hidden" />
                <span className="font-bold">TILTED?</span>
             </label>
             <label className={`flex-1 p-3 rounded-lg border cursor-pointer select-none transition-all flex items-center justify-center gap-2 ${regret ? 'bg-yellow-900/20 border-yellow-500 text-yellow-300' : 'border-gray-800 text-gray-500'}`}>
                <input type="checkbox" checked={regret} onChange={e => setRegret(e.target.checked)} className="hidden" />
                <span className="font-bold">Regret?</span>
             </label>
          </div>

          <TextArea 
            label="Reflection Notes"
            placeholder="Why did it work/fail? How do you feel now?"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={3}
          />

          <Button fullWidth onClick={handleSave} disabled={outcome === Outcome.Pending || followedPlan === null}>
            {trade.isComplete ? 'Update Journal Entry' : 'Complete Journal Entry'}
          </Button>

        </div>
      </div>
    </div>
  );
};