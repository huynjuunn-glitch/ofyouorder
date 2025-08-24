import { useLocation } from 'wouter';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { useState } from 'react';

export default function Header() {
  const [, setLocation] = useLocation();
  const { userEmail, logout } = useAuthStore();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleSettings = () => {
    // Dispatch event to open settings modal
    window.dispatchEvent(new CustomEvent('openSettingsModal'));
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🎂</span>
            <h1 className="text-2xl font-black text-white">케이크 매니저</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-pink-100" data-testid="text-user-email">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              data-testid="button-settings"
              className="flex items-center space-x-1 text-white hover:bg-pink-400 font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>설정</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="flex items-center space-x-1 text-white hover:bg-pink-400 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
