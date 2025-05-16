'use client';

import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { LogOut, PlusCircle, Settings, User } from 'lucide-react';
import { Button } from '../ui/button';

interface ProviderSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProviderSidebar({
  activeTab,
  setActiveTab,
}: ProviderSidebarProps) {
  //const { logout, user } = useAuth()

  const navItems = [
    // {
    //   name: "Dashboard",
    //   icon: Home,
    //   value: "dashboard",
    // },
    {
      name: 'My Solutions',
      icon: PlusCircle,
      value: 'solutions',
    },
    // {
    //   name: "Analytics",
    //   icon: BarChart3,
    //   value: "analytics",
    // },
    {
      name: 'Profile',
      icon: User,
      value: 'profile',
    },
    {
      name: 'Settings',
      icon: Settings,
      value: 'settings',
    },
  ];
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/';
        // router.push("/");
      },
    });
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 hidden md:block ">
      <div className="mb-8 px-4 py-3 ">
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
            {item.name}
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
