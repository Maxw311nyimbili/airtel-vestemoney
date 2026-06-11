import { useState } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(['ATEL', 'CEC', 'PUMA']);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const isWatchlisted = (symbol) => watchlist.includes(symbol);

  return { watchlist, toggleWatchlist, isWatchlisted };
}
