import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Create a deterministic ID based on email so data persists across logins
      const safeEmailId = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const userId = `user_${safeEmailId}`;

      const newUser: User = {
        id: userId,
        email,
        name: name || email.split('@')[0],
        isPro: false // Default to free tier
      };
      
      storageService.saveUser(newUser);
      onLogin(newUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">Reflectr<span className="text-neon">.</span></h1>
          <p className="text-gray-400 text-sm">Trade your mind first.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input 
              label="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Trader Joe"
              required 
            />
          )}
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="trader@example.com"
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            className="mt-6 h-12 text-lg"
          >
            {loading ? 'Processing...' : (isLogin ? 'Enter Journal' : 'Start Free Trial')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-neon transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};