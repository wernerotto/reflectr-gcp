import React, { useState, useEffect } from 'react';
import { User, Trade } from './types';
import { storageService } from './services/storageService';
import { stripeService } from './services/stripeService';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Timeline } from './components/Timeline';
import { CheckIn } from './components/CheckIn';
import { Debrief } from './components/Debrief';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [pendingDebriefTrade, setPendingDebriefTrade] = useState<Trade | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initial Load & Payment Check
  useEffect(() => {
    const savedUser = storageService.getUser();
    
    // Check if returning from Stripe
    const isPaymentSuccess = stripeService.checkPaymentSuccess();

    if (savedUser) {
      if (isPaymentSuccess && !savedUser.isPro) {
        // Upgrade User
        const upgradedUser = { ...savedUser, isPro: true };
        storageService.saveUser(upgradedUser);
        setUser(upgradedUser);
        setTrades(storageService.getTrades(upgradedUser.id));
        setShowSuccessModal(true);
        stripeService.clearPaymentParams();
      } else {
        // Normal Load
        setUser(savedUser);
        setTrades(storageService.getTrades(savedUser.id));
      }
    } else if (isPaymentSuccess) {
      // Edge case: User cleared local storage but returned from payment
      // Redirect to login or handle error
      stripeService.clearPaymentParams();
    }

    setLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setTrades(storageService.getTrades(newUser.id));
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setTrades([]);
    setActiveTab('dashboard');
  };

  const handleNewTrade = (trade: Trade) => {
    storageService.saveTrade(trade);
    setTrades(prev => [trade, ...prev]);
    setShowCheckIn(false);
    // Auto-switch to timeline to see it
    setActiveTab('timeline');
  };

  const handleUpdateTrade = (updatedTrade: Trade) => {
    storageService.saveTrade(updatedTrade);
    setTrades(prev => prev.map(t => t.id === updatedTrade.id ? updatedTrade : t));
    setPendingDebriefTrade(null);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-neon animate-pulse">Loading Reflectr...</div>;

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      onNavigate={setActiveTab}
      onCheckIn={() => setShowCheckIn(true)}
    >
      {activeTab === 'dashboard' && <Dashboard trades={trades} />}
      {activeTab === 'timeline' && <Timeline trades={trades} onSelect={setPendingDebriefTrade} />}
      {activeTab === 'insights' && <Insights trades={trades} isPro={user.isPro} />}
      {activeTab === 'settings' && <Settings user={user} trades={trades} onLogout={handleLogout} />}

      {/* Modals */}
      {showCheckIn && (
        <CheckIn 
          userId={user.id} 
          onComplete={handleNewTrade} 
          onCancel={() => setShowCheckIn(false)} 
        />
      )}

      {pendingDebriefTrade && (
        <Debrief 
          trade={pendingDebriefTrade} 
          onSave={handleUpdateTrade} 
          onClose={() => setPendingDebriefTrade(null)} 
        />
      )}

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <div className="bg-surface border border-neon rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(50,255,246,0.2)]">
            <div className="mx-auto w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-neon" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade Complete</h2>
            <p className="text-gray-400 mb-6">
              Welcome to Reflectr Pro. You now have full access to AI insights and pattern detection.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-neon text-black font-bold py-3 rounded-xl hover:bg-neon-dim transition-colors"
            >
              Start Trading
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;