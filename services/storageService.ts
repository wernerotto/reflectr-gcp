import { Trade, User, Outcome } from '../types';

const TRADES_KEY = 'reflectr_trades';
const USER_KEY = 'reflectr_user';

export const storageService = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getTrades: (userId: string): Trade[] => {
    const data = localStorage.getItem(TRADES_KEY);
    if (!data) return [];
    const trades = JSON.parse(data) as Trade[];
    return trades.filter(t => t.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  },

  saveTrade: (trade: Trade): void => {
    const data = localStorage.getItem(TRADES_KEY);
    const trades = data ? JSON.parse(data) as Trade[] : [];
    
    const index = trades.findIndex(t => t.id === trade.id);
    if (index >= 0) {
      trades[index] = trade;
    } else {
      trades.push(trade);
    }
    
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  },

  deleteTrade: (id: string): void => {
    const data = localStorage.getItem(TRADES_KEY);
    if (!data) return;
    const trades = JSON.parse(data) as Trade[];
    const filtered = trades.filter(t => t.id !== id);
    localStorage.setItem(TRADES_KEY, JSON.stringify(filtered));
  }
};
