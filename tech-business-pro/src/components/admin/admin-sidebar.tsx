'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, Briefcase, Settings, LogOutIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Partner Applications',
      href: '/admin/partner-application',
      icon: Briefcase,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
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
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8 px-4 py-3">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-4 py-3 text-sm rounded-md transition-colors',
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800',
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 w-52">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-500 cursor-pointer"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOutIcon className="h-4 w-4 mr-1" />

          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
}
