import React, { useState } from 'react';
import { User, Trade } from '../types';
import { Button } from './ui/Button';
import { stripeService } from '../services/stripeService';
import { LogOut, Download, CreditCard, Check, Loader2 } from 'lucide-react';

interface SettingsProps {
  user: User;
  trades: Trade[];
  onLogout: () => void;
  onUpgrade?: () => void; // Optional now as handled internally
}

export const Settings: React.FC<SettingsProps> = ({ user, trades, onLogout }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Symbol,Emotion,Impulse,Outcome,Reflection\n"
      + trades.map(t => `${new Date(t.timestamp).toISOString()},${t.symbol},${t.emotionalState},${t.impulsiveness},${t.outcome || 'Pending'},"${t.reflection || ''}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reflectr_journal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpgradeClick = async () => {
    setIsProcessing(true);
    try {
      await stripeService.startCheckout(user);
      // Logic continues in App.tsx after redirect
    } catch (error) {
      console.error("Payment initiation failed", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-surface border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Account</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${user.isPro ? 'bg-neon/10 border-neon text-neon' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
            {user.isPro ? 'PRO TIER' : 'FREE TIER'}
          </div>
        </div>
        <Button variant="secondary" onClick={onLogout} className="flex items-center gap-2">
          <LogOut size={16} /> Sign Out
        </Button>
      </div>

      {!user.isPro && (
        <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-xl font-bold mb-4">Upgrade Plan</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-800 rounded-xl p-4 bg-black/40">
              <h3 className="text-gray-400 font-medium mb-2">Basic</h3>
              <p className="text-2xl font-bold text-white mb-4">$9<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li className="flex items-center gap-2"><Check size={14} className="text-neon"/> Unlimited Journaling</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-neon"/> Basic Stats</li>
              </ul>
            </div>
            <div className="border border-neon rounded-xl p-4 bg-neon/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon text-black text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</div>
              <h3 className="text-white font-medium mb-2">Pro</h3>
              <p className="text-2xl font-bold text-white mb-4">$15<span className="text-sm font-normal text-gray-500">/mo</span></p>
               <ul className="text-sm text-gray-300 space-y-2 mb-4">
                <li className="flex items-center gap-2"><Check size={14} className="text-neon"/> Everything in Basic</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-neon"/> AI Insight Engine</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-neon"/> Pattern Detection</li>
              </ul>
              <Button 
                fullWidth 
                onClick={handleUpgradeClick} 
                disabled={isProcessing}
                className="shadow-[0_0_10px_rgba(50,255,246,0.2)]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={16} /> Redirecting...
                  </span>
                ) : (
                  'Upgrade Now'
                )}
              </Button>
            </div>
          </div>
           <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
             <CreditCard size={12}/> Secure payment via Stripe
           </p>
        </div>
      )}

      <div className="bg-surface border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Data Management</h2>
        <p className="text-sm text-gray-400 mb-4">Export all your journal entries to CSV for external analysis.</p>
        <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>
    </div>
  );
};