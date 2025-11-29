import React from 'react';
import { User } from '../types';
import { LayoutDashboard, History, Sparkles, Settings as SettingsIcon, Plus } from 'lucide-react';
import { Button } from './ui/Button';

interface LayoutProps {
  user: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onCheckIn: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, activeTab, onNavigate, onCheckIn, children }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-800 bg-surface sticky top-0 z-40">
        <h1 className="font-bold text-xl tracking-tighter">Reflectr<span className="text-neon">.</span></h1>
        <Button onClick={onCheckIn} className="h-8 text-xs px-3">
          <Plus size={14} className="mr-1" /> New Trade
        </Button>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-surface fixed h-full p-6">
        <div className="mb-10">
           <h1 className="font-bold text-2xl tracking-tighter">Reflectr<span className="text-neon">.</span></h1>
           <p className="text-xs text-gray-500 mt-1">Trade your mind first.</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-neon/10 text-neon border border-neon/20 shadow-[0_0_10px_rgba(50,255,246,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800">
          <Button fullWidth onClick={onCheckIn} className="shadow-[0_0_20px_rgba(50,255,246,0.15)] hover:shadow-[0_0_25px_rgba(50,255,246,0.3)]">
            <Plus size={18} className="mr-2" /> Check-In
          </Button>
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600"></div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.isPro ? 'Pro Member' : 'Free Member'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
           {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-surface border-t border-gray-800 flex justify-around p-3 z-40 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === item.id ? 'text-neon' : 'text-gray-500'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
