'use client';

import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { LogOut, PlusCircle, User, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useEffect, useState } from 'react';
import { getUnreadContactRequestsCount } from '@/app/actions/contact-provider-action';

interface ProviderSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  providerId?: number;
}

export function ProviderSidebar({
  activeTab,
  setActiveTab,
  providerId,
}: ProviderSidebarProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { logoutMutation } = useAuth();

  // Fetch unread contact requests count
  useEffect(() => {
    if (providerId) {
      const fetchUnreadCount = async () => {
        try {
          const result = await getUnreadContactRequestsCount(providerId);
          if (result.success) {
            setUnreadCount(result.count);
          }
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      };

      fetchUnreadCount();

      // Set up polling to check for new requests every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [providerId]);

  const navItems = [
    {
      name: 'My Expertise',
      icon: PlusCircle,
      value: 'solutions',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      value: 'messages',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      name: 'Profile',
      icon: User,
      value: 'profile',
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/';
      },
    });
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 hidden md:block">
      <div className="mb-8 px-4 py-3">
        <h1 className="text-xl font-bold">Provider Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your tech solutions</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveTab(item.value)}
            className={cn(
              'flex items-center w-full px-4 py-3 text-sm rounded-md transition-colors',
              activeTab === item.value
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800',
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="flex-1 text-left">{item.name}</span>
            {item.badge && (
              <Badge className="ml-auto bg-blue-600 hover:bg-blue-700">
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 w-52">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-500"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4 mr-1" />
          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
}
