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
    <header className="bg-slate-700 shadow-lg border-b border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎂</span>
            <h1 className="text-xl font-bold text-white">케이크 매니저</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-200" data-testid="text-user-email">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              data-testid="button-settings"
              className="flex items-center space-x-1 text-slate-200 hover:bg-slate-600"
            >
              <Settings className="w-4 h-4" />
              <span>설정</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="flex items-center space-x-1 text-slate-200 hover:bg-slate-600"
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
