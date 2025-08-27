// src/app/watchlist/page.tsx
import WatchlistManager from '@/components/watchlist/WatchlistManager';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'My Watchlist | DTIS',
  description: 'Manage your personal digital threat watchlist to receive real-time alerts.',
};

const WatchlistPage = () => {
  return (
    <div className="py-8">
      <WatchlistManager />
    </div>
  );
};

export default WatchlistPage;
