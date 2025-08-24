import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/Header';
import CalendarCard from '@/components/CalendarCard';
import OrdersTable from '@/components/OrdersTable';
import StatisticsCards from '@/components/StatisticsCards';
import SettingsModal from '@/components/SettingsModal';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, checkAuth, setLocation]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarCard />
        <OrdersTable />
        <StatisticsCards />
      </main>
      
      <SettingsModal />
    </div>
  );
}
